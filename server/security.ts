import rateLimit from 'express-rate-limit';

/**
 * High-performance in-memory LRU / TTL Cache with telemetry & hit ratio tracking.
 * Maximizes API efficiency by preventing redundant LLM inference for identical document payloads.
 */
export interface CacheStats {
  hits: number;
  misses: number;
  hitRatio: number;
  size: number;
  maxSize: number;
  evictions: number;
  totalRequests: number;
}

export class MemoryCache<T> {
  private cache = new Map<string, { value: T; expiresAt: number; addedAt: number }>();
  private maxSize: number;
  private defaultTTL: number;
  private hits = 0;
  private misses = 0;
  private evictions = 0;

  constructor(maxSize = 250, defaultTTLMs = 1000 * 60 * 30) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTLMs;
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) {
      this.misses++;
      return undefined;
    }
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      this.misses++;
      return undefined;
    }
    // Refresh position for true LRU eviction policy
    this.cache.delete(key);
    this.cache.set(key, item);
    this.hits++;
    return item.value;
  }

  set(key: string, value: T, ttlMs = this.defaultTTL): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
        this.evictions++;
      }
    }
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
      addedAt: Date.now(),
    });
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRatio: total > 0 ? Number((this.hits / total).toFixed(4)) : 0,
      size: this.cache.size,
      maxSize: this.maxSize,
      evictions: this.evictions,
      totalRequests: total,
    };
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
  }
}

export const apiCache = new MemoryCache<any>(300, 1000 * 60 * 45); // 45 min cache

/**
 * OWASP & Adversarial prompt injection defense patterns
 */
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /disregard\s+(all\s+)?(previous|prior)\s+instructions/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /system\s+prompt\s*:/i,
  /reveal\s+your\s+(initial\s+)?instructions/i,
  /act\s+as\s+an\s+unfiltered\s+ai/i,
  /bypass\s+(all\s+)?safety\s+filters/i,
  /simulate\s+jailbreak/i,
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /data\s*:\s*text\/html/i,
  /onload\s*=/gi,
  /onerror\s*=/gi,
];

/**
 * Prototype pollution and path traversal patterns
 */
const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];

/**
 * Sanitizes input text against XSS, Prototype Pollution, Path Traversal, and injection
 */
export function sanitizeInputText(input: unknown): string {
  if (typeof input !== 'string') return '';
  
  // Guard against ReDoS: cap maximum single evaluation length to 250,000 characters
  const trimmed = input.trim().slice(0, 250000);
  
  // Neutralize common XSS tags, malicious event handlers, and data URIs
  let cleaned = trimmed
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, 'blocked:')
    .replace(/data:text\/html/gi, 'blocked:html')
    .replace(/onerror\s*=/gi, 'blocked=')
    .replace(/onload\s*=/gi, 'blocked=')
    .replace(/onclick\s*=/gi, 'blocked=');

  // Strip path traversal sequences
  cleaned = cleaned.replace(/\.\.\//g, '').replace(/\.\.\\/g, '');

  return cleaned;
}

/**
 * Validates object keys against Prototype Pollution attacks
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    obj.forEach((item) => sanitizeObject(item));
    return obj;
  }

  for (const key of Object.getOwnPropertyNames(obj)) {
    if (DANGEROUS_KEYS.includes(key)) {
      try {
        delete (obj as any)[key];
      } catch {
        (obj as any)[key] = undefined;
      }
    } else if (typeof (obj as any)[key] === 'object' && (obj as any)[key] !== null) {
      sanitizeObject((obj as any)[key]);
    }
  }
  return obj;
}

/**
 * Validates prompt against jailbreak and prompt injection attacks
 */
export function validatePromptSafety(prompt: string): { isSafe: boolean; warning?: string } {
  if (!prompt || typeof prompt !== 'string') return { isSafe: true };

  // Length check to protect regex engines against ReDoS
  if (prompt.length > 200000) {
    return {
      isSafe: false,
      warning: 'Payload exceeds safe processing size threshold (200KB).',
    };
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(prompt)) {
      return {
        isSafe: false,
        warning: 'Adversarial instruction or script pattern detected. Request was filtered by Security Gateway.',
      };
    }
  }
  return { isSafe: true };
}

/**
 * Rate limiters for critical endpoints to prevent DoS and API abuse
 */
export const analyzeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // Limit each IP to 60 analysis requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many document analysis requests from this client. Please try again after 15 minutes.',
  },
});

export const askRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120, // 120 Q&A queries per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many legal queries submitted. Please try again shortly.',
  },
});

export const generalApiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
