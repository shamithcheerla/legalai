export type AttentionLevel = 'Informational' | 'Review' | 'Important' | 'High Attention';

export interface Evidence {
  documentId: string;
  documentName: string;
  page: number;
  section: string;
  sourceText: string;
  confidence: number; // 0.0 - 1.0
}

export type ClauseCategory =
  | 'Parties'
  | 'Payments'
  | 'Responsibilities'
  | 'Term'
  | 'Termination'
  | 'Liability'
  | 'Confidentiality'
  | 'Intellectual Property'
  | 'Data/Privacy'
  | 'Dispute Resolution'
  | 'Governing Law'
  | 'Renewal'
  | 'Penalties'
  | 'Restrictions'
  | 'Insurance'
  | 'Indemnity'
  | 'Non-compete / non-solicit'
  | 'Warranties'
  | 'Notices'
  | 'Special Conditions';

export interface Clause {
  id: string;
  title: string;
  category: ClauseCategory;
  originalText: string;
  plainExplanation: string;
  explain15: string;
  affects: string;
  userObligation?: string;
  otherPartyObligation?: string;
  financialImpact?: string;
  timeImpact?: string;
  attentionLevel: AttentionLevel;
  whyItMatters: string;
  page: number;
  section: string;
  evidence: Evidence;
}

export interface AttentionItem {
  id: string;
  title: string;
  category: string;
  attentionLevel: AttentionLevel;
  detectedIssue: string;
  whyItDeservesAttention: string;
  whatUserShouldClarify: string;
  professionalReviewAdvice: string;
  evidence: Evidence;
}

export interface Obligation {
  id: string;
  title: string;
  responsibleParty: string;
  deadline: string;
  trigger: string;
  frequency: 'One-time' | 'Monthly' | 'Annual' | 'On Event' | 'As Needed';
  amount?: string;
  consequence: string;
  sourceClause: string;
  confidence: number;
  completed?: boolean;
  evidence: Evidence;
}

export interface DeadlineItem {
  id: string;
  title: string;
  dateOrTimeline: string;
  isRelative: boolean;
  relativeReference?: string;
  significance: string;
  page: number;
  section: string;
  evidence: Evidence;
}

export interface FinancialItem {
  id: string;
  label: string;
  amount: string;
  currency: string;
  timingType: 'one-time' | 'recurring' | 'conditional' | 'penalties' | 'variable';
  description: string;
  evidence: Evidence;
}

export interface InconsistencyItem {
  id: string;
  title: string;
  description: string;
  provisionA: {
    section: string;
    page: number;
    text: string;
  };
  provisionB: {
    section: string;
    page: number;
    text: string;
  };
  whyInconsistent: string;
  recommendation: string;
}

export interface MissingInformationItem {
  id: string;
  title: string;
  category: string;
  missingElement: string;
  whyImportant: string;
  recommendation: string;
}

export interface LawyerQuestion {
  id: string;
  question: string;
  rationale: string;
  relatedSection: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface DocumentOverview {
  id: string;
  title: string;
  type: string;
  parties: string[];
  effectiveDate: string | null;
  expiryDate: string | null;
  jurisdiction: string | null;
  language: string;
  pageCount: number;
  confidence: number;
  analysisTimestamp: string;
  rawText: string;
}

export interface DocumentAnalysis {
  overview: DocumentOverview;
  executiveSummary: {
    whatThisIs: string;
    whoIsInvolved: string;
    expectedResponsibilities: string;
    financialSummary: string;
    durationAndTerm: string;
    howTerminationWorks: string;
    failureConsequences: string;
    keyThingsToReview: string;
  };
  clauses: Clause[];
  attentionItems: AttentionItem[];
  obligations: Obligation[];
  deadlines: DeadlineItem[];
  financialItems: FinancialItem[];
  inconsistencies: InconsistencyItem[];
  missingInformation: MissingInformationItem[];
  lawyerQuestions: LawyerQuestion[];
}

export interface ClauseDiff {
  id: string;
  title: string;
  category: string;
  changeType: 'added' | 'removed' | 'modified' | 'unchanged';
  beforeText?: string;
  afterText?: string;
  summary: string;
  practicalSignificance: string;
  financialImpact?: string;
  attentionLevel: AttentionLevel;
  evidenceBefore?: Evidence;
  evidenceAfter?: Evidence;
}

export interface ComparisonResult {
  docAId: string;
  docAName: string;
  docBId: string;
  docBName: string;
  overviewSummary: string;
  stats: {
    totalChanges: number;
    addedCount: number;
    removedCount: number;
    modifiedCount: number;
    unchangedCount: number;
    financialChanges: number;
    deadlineChanges: number;
    obligationChanges: number;
    terminationChanges: number;
  };
  differences: ClauseDiff[];
}

export interface QAAnswer {
  question: string;
  answer: string;
  confidence: 'High' | 'Medium' | 'Low';
  evidence: Evidence[];
  relatedClauses: string[];
  documentFacts: string[];
  aiInterpretation: string;
  reviewSuggested?: string;
  timestamp: string;
}

export interface ActionItem {
  id: string;
  title: string;
  category: 'review' | 'upcoming' | 'clarify' | 'gather' | 'ask_counsel';
  status: 'pending' | 'completed' | 'dismissed';
  notes?: string;
  dueDate?: string;
  priority: 'High' | 'Medium' | 'Low';
  sourceDocumentId?: string;
  sourceSection?: string;
}

export interface PersonalNote {
  id: string;
  documentId: string;
  clauseId?: string;
  text: string;
  tags: string[];
  createdAt: string;
}
