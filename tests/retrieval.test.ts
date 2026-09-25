import { describe, it, expect } from 'vitest';
import { chunkLegalDocument, retrieveRelevantChunks } from '../server/retrieval';

describe('Legal Document Chunker & Retrieval Engine', () => {
  const sampleLegalText = `
RESIDENTIAL LEASE AGREEMENT

SECTION 1. PREMISES AND OCCUPANCY
The Landlord agrees to lease the premises situated at 742 Evergreen Terrace to the Tenant.
The premises shall be occupied solely by the named individuals as a private residential dwelling.

SECTION 2. TERM AND RENEWAL
The initial term shall commence on September 1, 2026, and expire on August 31, 2027.
This agreement shall automatically renew for additional 12-month periods unless either party delivers written notice 60 days prior.

SECTION 3. RENT AND LATE FEES
Tenant shall pay monthly rent of $2,400 due on the first day of each month.
A late fee of $150 or 5% of monthly rent shall be assessed if rent is not received by the 5th calendar day.

SECTION 4. SECURITY DEPOSIT
The tenant shall deposit the sum of $4,800 as security.
The deposit will be returned within 21 business days following move-out inspection.
`;

  it('correctly chunks legal document by sections and headings', () => {
    const chunks = chunkLegalDocument(sampleLegalText, 'test_doc_1', 'Sample Lease');

    expect(chunks.length).toBeGreaterThanOrEqual(4);
    expect(chunks.some(c => c.section.toLowerCase().includes('premises'))).toBe(true);
    expect(chunks.some(c => c.section.toLowerCase().includes('rent'))).toBe(true);
    expect(chunks.some(c => c.section.toLowerCase().includes('security deposit'))).toBe(true);
  });

  it('assigns correct document ID and metadata to each chunk', () => {
    const chunks = chunkLegalDocument(sampleLegalText, 'doc_abc123', 'My Lease');

    chunks.forEach(chunk => {
      expect(chunk.documentId).toBe('doc_abc123');
      expect(chunk.documentName).toBe('My Lease');
      expect(chunk.page).toBeGreaterThanOrEqual(1);
      expect(chunk.text.length).toBeGreaterThan(10);
    });
  });

  it('retrieves relevant chunks with high BM25 scores for keyword queries', () => {
    const chunks = chunkLegalDocument(sampleLegalText, 'test_doc_1', 'Sample Lease');

    const rentResults = retrieveRelevantChunks('What is the monthly rent and late fee?', chunks, 3);
    expect(rentResults.length).toBeGreaterThan(0);
    expect(rentResults[0].chunk.section.toLowerCase()).toContain('rent');
    expect(rentResults[0].score).toBeGreaterThan(0);

    const depositResults = retrieveRelevantChunks('How much is the security deposit?', chunks, 3);
    expect(depositResults.length).toBeGreaterThan(0);
    expect(depositResults[0].chunk.section.toLowerCase()).toContain('security deposit');
  });

  it('handles empty query gracefully by returning candidate chunks', () => {
    const chunks = chunkLegalDocument(sampleLegalText, 'test_doc_1', 'Sample Lease');
    const results = retrieveRelevantChunks('', chunks, 2);

    expect(results.length).toBe(2);
  });

  it('handles short or malformed documents gracefully without crashing', () => {
    const emptyChunks = chunkLegalDocument('', 'doc_empty', 'Empty Doc');
    expect(emptyChunks).toEqual([]);

    const shortChunks = chunkLegalDocument('Short line', 'doc_short', 'Short Doc');
    expect(Array.isArray(shortChunks)).toBe(true);
  });
});
