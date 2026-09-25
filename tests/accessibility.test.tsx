import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from '../src/components/Navbar';
import { Sidebar } from '../src/components/Sidebar';
import { DocumentUploadModal } from '../src/components/DocumentUploadModal';
import { AskLegalens } from '../src/components/AskLegalens';
import { DEMO_RENTAL_ANALYSIS } from '../src/data/demoDocuments';

describe('Accessibility & WCAG 2.1 AA Compliance Suite', () => {
  describe('Navbar Accessibility', () => {
    it('renders with banner role and accessible landmark', () => {
      render(
        <Navbar
          currentTab="dashboard"
          onNavigate={() => {}}
          onOpenUpload={() => {}}
          explain15Global={false}
          onToggleExplain15={() => {}}
          currentDocumentTitle="Test Document"
        />
      );

      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('provides accessible label for search input', () => {
      render(
        <Navbar
          currentTab="dashboard"
          onNavigate={() => {}}
          onOpenUpload={() => {}}
          explain15Global={false}
          onToggleExplain15={() => {}}
        />
      );

      const searchInput = screen.getByRole('searchbox');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('id', 'global-search-input');
    });

    it('provides accessible aria-pressed state on toggle buttons', () => {
      const { rerender } = render(
        <Navbar
          currentTab="dashboard"
          onNavigate={() => {}}
          onOpenUpload={() => {}}
          explain15Global={false}
          onToggleExplain15={() => {}}
        />
      );

      const toggleBtn = screen.getByRole('button', { name: /Explain Like I'm 15/i });
      expect(toggleBtn).toHaveAttribute('aria-pressed', 'false');

      rerender(
        <Navbar
          currentTab="dashboard"
          onNavigate={() => {}}
          onOpenUpload={() => {}}
          explain15Global={true}
          onToggleExplain15={() => {}}
        />
      );
      expect(toggleBtn).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Sidebar Navigation Accessibility', () => {
    it('renders accessible tablist and navigation landmark', () => {
      render(
        <Sidebar
          currentTab="dashboard"
          onSelectTab={() => {}}
        />
      );

      const aside = screen.getByLabelText(/Sidebar navigation/i);
      expect(aside).toBeInTheDocument();

      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
    });

    it('marks active tab with aria-selected="true" and inactive tabs with "false"', () => {
      render(
        <Sidebar
          currentTab="dashboard"
          onSelectTab={() => {}}
        />
      );

      const dashboardTab = screen.getByRole('tab', { name: /Executive Dashboard/i });
      expect(dashboardTab).toHaveAttribute('aria-selected', 'true');

      const viewerTab = screen.getByRole('tab', { name: /Document Viewer/i });
      expect(viewerTab).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Document Upload Modal Accessibility', () => {
    it('renders as an accessible modal dialog with aria-modal="true"', () => {
      render(
        <DocumentUploadModal
          isOpen={true}
          onClose={() => {}}
        />
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-upload-title');
    });

    it('has accessible buttons with readable names', () => {
      render(
        <DocumentUploadModal
          isOpen={true}
          onClose={() => {}}
        />
      );

      expect(screen.getByRole('button', { name: /Close document upload dialog/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Start Legal Analysis/i })).toBeInTheDocument();
    });
  });

  describe('AskLegalens Q&A Accessibility', () => {
    it('provides accessible form label for question input and submit button', () => {
      render(
        <AskLegalens
          analysis={DEMO_RENTAL_ANALYSIS}
          onAskQuestion={vi.fn()}
          onSelectClause={vi.fn()}
          onNavigateTab={vi.fn()}
        />
      );

      const input = screen.getByPlaceholderText(/Can the landlord enter without notice/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('id', 'ask-legalens-question-input');

      const askBtn = screen.getByRole('button', { name: /Submit question to Legalens AI/i });
      expect(askBtn).toBeInTheDocument();
    });
  });
});
