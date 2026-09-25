import rateLimit from 'express-rate-limit';

/**
 * In-memory LRU / TTL Cache for high-performance retrieval and API responses.
 * Boosts API efficiency by avoiding duplicate expensive compute for identical legal texts.
 */
class MemoryCache<T> {
  private cache = new Map<string, { value: T; expiresAt: number }>();
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize = 100, defaultTTLMs = 1000 * 60 * 30) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTLMs;
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    // Refresh position for LRU
    this.cache.delete(key);
    this.cache.set(key, item);
    return item.value;
  }

  set(key: string, value: T, ttlMs = this.defaultTTL): void {
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new MemoryCache<any>(200, 1000 * 60 * 30); // 30 min cache

/**
 * Prompt injection patterns to detect and mitigate adversarial inputs
 */
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /disregard\s+(all\s+)?(previous|prior)\s+instructions/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /system\s+prompt\s*:/i,
  /reveal\s+your\s+(initial\s+)?instructions/i,
  /act\s+as\s+an\s+unfiltered\s+ai/i,
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /onload\s*=/gi,
  /onerror\s*=/gi,
];

/**
 * Sanitizes input text against XSS and adversarial prompt injections
 */
export function sanitizeInputText(input: unknown): string {
  if (typeof input !== 'string') return '';
  
  let cleaned = input.trim();
  
  // Neutralize common XSS tags
  cleaned = cleaned
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, 'blocked:')
    .replace(/onerror=/gi, 'blocked=')
    .replace(/onload=/gi, 'blocked=');

  return cleaned;
}

/**
 * Validates prompt against jailbreak and prompt injection attacks
 */
export function validatePromptSafety(prompt: string): { isSafe: boolean; warning?: string } {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(prompt)) {
      return {
        isSafe: false,
        warning: 'Adversarial instruction detected. Request was filtered by Security Gateway.',
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
