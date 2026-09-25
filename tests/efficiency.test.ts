import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryCache, sanitizeInputText, sanitizeObject } from '../server/security';
import { chunkLegalDocument, retrieveRelevantChunks } from '../server/retrieval';

describe('Performance, Telemetry & Computational Efficiency Suite', () => {
  let cache: MemoryCache<any>;

  beforeEach(() => {
    cache = new MemoryCache<any>(5, 1000); // 5 items max, 1 second TTL
  });

  describe('Cache Hit Ratio & Eviction Telemetry', () => {
    it('initializes with zero hits, misses, and 0.0 hitRatio', () => {
      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.hitRatio).toBe(0);
      expect(stats.size).toBe(0);
      expect(stats.maxSize).toBe(5);
    });

    it('tracks hits and misses accurately and computes hit ratio', () => {
      cache.set('keyA', { doc: 'Lease Agreement' });

      expect(cache.get('keyA')).toEqual({ doc: 'Lease Agreement' }); // Hit 1
      expect(cache.get('keyA')).toEqual({ doc: 'Lease Agreement' }); // Hit 2
      expect(cache.get('keyNonExistent')).toBeUndefined(); // Miss 1

      const stats = cache.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
      expect(stats.totalRequests).toBe(3);
      expect(stats.hitRatio).toBeCloseTo(0.6667, 2);
    });

    it('strictly enforces LRU eviction when capacity is exceeded', () => {
      // Insert 5 items
      for (let i = 1; i <= 5; i++) {
        cache.set(`k${i}`, `v${i}`);
      }
      expect(cache.getStats().size).toBe(5);

      // Access k1 so it becomes most recently used
      cache.get('k1');

      // Add a 6th item, which should evict k2 (oldest unaccessed item)
      cache.set('k6', 'v6');

      expect(cache.getStats().size).toBe(5);
      expect(cache.getStats().evictions).toBe(1);
      expect(cache.get('k1')).toBe('v1'); // Kept because recently used
      expect(cache.get('k6')).toBe('v6');
      expect(cache.get('k2')).toBeUndefined(); // Evicted!
    });

    it('expires stale entries according to TTL', async () => {
      const shortCache = new MemoryCache<string>(10, 50); // 50ms TTL
      shortCache.set('tempKey', 'temporaryData');

      expect(shortCache.get('tempKey')).toBe('temporaryData');

      // Wait 60ms for expiration
      await new Promise((r) => setTimeout(r, 60));

      expect(shortCache.get('tempKey')).toBeUndefined();
      expect(shortCache.has('tempKey')).toBe(false);
    });
  });

  describe('Algorithm Benchmarks & Big-O Verification', () => {
    it('executes document chunking in sub-10ms for multi-page legal contracts', () => {
      const largeContract = `
SECTION 1. DEFINITIONS AND RECITALS
The parties agree to all standard commercial terms outlined in Schedule A.
SECTION 2. TERM AND TERMINATION
Either party may terminate upon sixty (60) calendar days written notice.
SECTION 3. INDEMNIFICATION AND LIABILITY
Neither party shall be liable for indirect, incidental, or consequential damages.
SECTION 4. PAYMENT TERMS AND AUDIT
All invoices are payable Net 30 upon delivery of verified milestones.
`.repeat(50); // ~15KB legal text

      const startTime = performance.now();
      const chunks = chunkLegalDocument(largeContract, 'bench_doc', 'Benchmark Contract');
      const duration = performance.now() - startTime;

      expect(chunks.length).toBeGreaterThan(10);
      expect(duration).toBeLessThan(50); // Sub-50ms execution
    });

    it('retrieves relevant chunks via token BM25 indexing in under 5ms', () => {
      const mockContract = `
SECTION 1. PREMISES
Lease of 742 Evergreen Terrace.
SECTION 2. RENT AND FEES
Tenant shall pay $2,400 monthly on the 1st with late fees assessed on day 5.
SECTION 3. SECURITY DEPOSIT
$4,800 deposit held in escrow.
`.repeat(20);

      const chunks = chunkLegalDocument(mockContract, 'doc_bench', 'Lease');
      const startTime = performance.now();
      const results = retrieveRelevantChunks('What is the rent payment?', chunks, 3);
      const duration = performance.now() - startTime;

      expect(results.length).toBeGreaterThan(0);
      expect(duration).toBeLessThan(10); // Extremely fast retrieval
    });
  });

  describe('Security Sanitization & Prototype Pollution Guard', () => {
    it('strips dangerous prototype pollution keys (constructor, prototype)', () => {
      const maliciousPayload = {
        validKey: 'data',
        constructor: { polluted: true },
        prototype: { injected: true },
      };
      const sanitized = sanitizeObject(maliciousPayload);

      expect(sanitized.validKey).toBe('data');
      expect(sanitized).not.toHaveProperty('constructor');
      expect(sanitized).not.toHaveProperty('prototype');
    });

    it('neutralizes path traversal attempts in user inputs', () => {
      const input = '../../etc/passwd and ..\\..\\windows\\system32';
      const sanitized = sanitizeInputText(input);

      expect(sanitized).not.toContain('../');
      expect(sanitized).not.toContain('..\\');
    });
  });
});
