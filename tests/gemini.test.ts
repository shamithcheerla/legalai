import { describe, it, expect } from 'vitest';
import { isGeminiAvailable } from '../server/gemini';
import {
  DEMO_RENTAL_ANALYSIS,
  DEMO_SERVICE_COMPARISON,
  DEMO_DOCUMENTS,
} from '../src/data/demoDocuments';

describe('Legalens AI Knowledge & Parsing Engine', () => {
  it('exposes Gemini availability check function', () => {
    const available = isGeminiAvailable();
    expect(typeof available).toBe('boolean');
  });

  describe('Demo Document Data Completeness', () => {
    it('provides rich preloaded contracts for instant testing', () => {
      expect(DEMO_DOCUMENTS.length).toBeGreaterThanOrEqual(2);
      expect(DEMO_DOCUMENTS[0].name).toContain('Residential Lease');
    });

    it('ensures rental analysis contains all structured intelligence modules', () => {
      const analysis = DEMO_RENTAL_ANALYSIS;

      // Executive overview
      expect(analysis.overview.title).toBeDefined();
      expect(analysis.overview.type).toBe('Residential Lease / Rental Contract');
      expect(analysis.overview.pageCount).toBe(3);
      expect(analysis.executiveSummary.whatThisIs).toBeDefined();

      // Clauses
      expect(analysis.clauses.length).toBeGreaterThanOrEqual(7);
      analysis.clauses.forEach((clause) => {
        expect(clause.id).toBeDefined();
        expect(clause.section).toBeDefined();
        expect(clause.plainExplanation).toBeDefined();
        expect(clause.explain15).toBeDefined();
        expect(clause.evidence.sourceText).toBeDefined();
      });

      // Obligations
      expect(analysis.obligations.length).toBeGreaterThanOrEqual(5);
      analysis.obligations.forEach((ob) => {
        expect(ob.responsibleParty).toBeDefined();
        expect(ob.title).toBeDefined();
      });

      // Attention items
      expect(analysis.attentionItems.length).toBeGreaterThanOrEqual(4);
      analysis.attentionItems.forEach((item) => {
        expect(item.attentionLevel).toBeDefined();
        expect(item.detectedIssue).toBeDefined();
        expect(item.evidence.section).toBeDefined();
      });

      // Inconsistencies and missing items
      expect(analysis.inconsistencies.length).toBeGreaterThanOrEqual(1);
      expect(analysis.missingInformation.length).toBeGreaterThanOrEqual(1);
    });

    it('ensures document comparison has structured diff insights', () => {
      const comparison = DEMO_SERVICE_COMPARISON;
      expect(comparison.docAName).toBeDefined();
      expect(comparison.docBName).toBeDefined();
      expect(comparison.differences.length).toBeGreaterThan(0);
      expect(comparison.overviewSummary).toBeDefined();
      expect(comparison.stats.totalChanges).toBeGreaterThan(0);
    });
  });
});
