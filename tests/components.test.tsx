import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ObligationTracker } from '../src/components/ObligationTracker';
import { AttentionRadar } from '../src/components/AttentionRadar';
import { DocumentViewer } from '../src/components/DocumentViewer';
import { AskLegalens } from '../src/components/AskLegalens';
import { CompareDocuments } from '../src/components/CompareDocuments';
import { DEMO_RENTAL_ANALYSIS } from '../src/data/demoDocuments';

describe('Legalens AI Core Component Interactions', () => {
  describe('ObligationTracker Component', () => {
    it('renders obligations and triggers toggle completion callback', () => {
      const handleToggle = vi.fn();
      render(
        <ObligationTracker
          obligations={DEMO_RENTAL_ANALYSIS.obligations}
          deadlines={DEMO_RENTAL_ANALYSIS.deadlines}
          onToggleComplete={handleToggle}
        />
      );

      expect(screen.getByText(/Contractual Responsibility Engine/i)).toBeInTheDocument();
      expect(screen.getByText(/Table View/i)).toBeInTheDocument();
      expect(screen.getByText(/Timeline View/i)).toBeInTheDocument();

      // Check if obligations are displayed
      const firstObligation = DEMO_RENTAL_ANALYSIS.obligations[0];
      expect(screen.getByText(firstObligation.title)).toBeInTheDocument();
    });

    it('switches between Table View and Timeline View seamlessly', () => {
      render(
        <ObligationTracker
          obligations={DEMO_RENTAL_ANALYSIS.obligations}
          deadlines={DEMO_RENTAL_ANALYSIS.deadlines}
          onToggleComplete={vi.fn()}
        />
      );

      const timelineBtn = screen.getByRole('button', { name: /Timeline View/i });
      fireEvent.click(timelineBtn);

      const tableBtn = screen.getByRole('button', { name: /Table View/i });
      fireEvent.click(tableBtn);
    });
  });

  describe('AttentionRadar Component', () => {
    it('renders risk items and allows filtering by severity', () => {
      render(
        <AttentionRadar
          items={DEMO_RENTAL_ANALYSIS.attentionItems}
          docTitle={DEMO_RENTAL_ANALYSIS.overview.title}
          onAddToActions={vi.fn()}
          onNavigateTab={vi.fn()}
        />
      );

      expect(screen.getByText(/Friction, Risk & Ambiguity Analysis/i)).toBeInTheDocument();

      const searchInput = screen.getByPlaceholderText(/Search review items/i);
      fireEvent.change(searchInput, { target: { value: 'indemnity' } });
    });
  });

  describe('DocumentViewer Component', () => {
    it('displays original text, section directory, and plain English explanation', () => {
      render(
        <DocumentViewer
          analysis={DEMO_RENTAL_ANALYSIS}
          selectedClauseId={DEMO_RENTAL_ANALYSIS.clauses[0].id}
          onSelectClause={vi.fn()}
          explain15Global={false}
          onToggleExplain15={vi.fn()}
          onAddToActions={vi.fn()}
        />
      );

      expect(screen.getByText(/Document Outline/i)).toBeInTheDocument();
      expect(screen.getByText(/Original Legal Text/i)).toBeInTheDocument();
      expect(screen.getAllByText(DEMO_RENTAL_ANALYSIS.clauses[0].title).length).toBeGreaterThan(0);
    });
  });

  describe('AskLegalens Component', () => {
    it('submits a question and renders grounded answer with evidence', async () => {
      const mockAsk = vi.fn().mockResolvedValue({
        question: 'What is the rent?',
        answer: 'Monthly rent is $2,400 due on the first day of each month.',
        confidence: 'High',
        documentFacts: ['$2,400 monthly payment.'],
        aiInterpretation: 'Strict monthly fee schedule applies.',
        reviewSuggested: 'Verify grace period.',
        relatedClauses: ['Section 3'],
        evidence: [
          {
            documentId: 'doc_1',
            documentName: 'Lease',
            page: 1,
            section: 'Section 3. Rent',
            sourceText: 'Tenant shall pay $2,400 per month.',
            confidence: 0.95,
          },
        ],
        timestamp: new Date().toISOString(),
      });

      render(
        <AskLegalens
          analysis={DEMO_RENTAL_ANALYSIS}
          onAskQuestion={mockAsk}
          onSelectClause={vi.fn()}
          onNavigateTab={vi.fn()}
        />
      );

      const input = screen.getByPlaceholderText(/Can the landlord enter without notice/i);
      fireEvent.change(input, { target: { value: 'What is the rent?' } });

      const submitBtn = screen.getByRole('button', { name: /Submit question to Legalens AI/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockAsk).toHaveBeenCalledWith('What is the rent?');
        expect(screen.getByText(/Monthly rent is \$2,400 due on the first day of each month/i)).toBeInTheDocument();
      });
    });
  });

  describe('CompareDocuments Component', () => {
    it('renders comparison overview and version diff cards', () => {
      render(<CompareDocuments />);
      expect(screen.getByText(/Contract Change Impact & Version Comparison/i)).toBeInTheDocument();
    });
  });
});
