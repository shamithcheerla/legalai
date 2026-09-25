import { GoogleGenAI, Type } from '@google/genai';
import { DocumentAnalysis, ComparisonResult, QAAnswer } from '../src/types/legal';
import { chunkLegalDocument, retrieveRelevantChunks } from './retrieval';

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export function isGeminiAvailable(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '' && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
}

/**
 * System prompt for strict evidence-grounded legal document analysis
 */
const LEGAL_ANALYSIS_SYSTEM_PROMPT = `You are LEGALENS AI, an expert legal intelligence system built to make legal documents accessible, transparent, and actionable.

CRITICAL OPERATING DIRECTIVES:
1. EVIDENCE FIRST: Every single fact, clause, obligation, financial number, and deadline must be directly grounded in the provided document text. Include the exact quote and section.
2. ANTI-HALLUCINATION: NEVER fabricate a clause, penalty, statute, case precedent, or date. If an element is missing, state it in missingInformation.
3. FACT VS INTERPRETATION: Distinguish what the document explicitly says from the AI plain-language interpretation.
4. ATTENTION IS NOT ILLEGAL: Use attention levels ('Informational', 'Review', 'Important', 'High Attention'). Do NOT call something "illegal" or "legally invalid"; state "This clause may deserve professional review because...".
5. NO LEGAL ADVICE: Provide educational, plain-language analysis to help the user prepare for a consultation with a qualified legal professional.
6. EXPLAIN LIKE I'M 15: For each clause, provide both a standard plain-English translation and an ultra-simple "explain15" version using clear everyday metaphors without altering the legal meaning.
7. DETECT INCONSISTENCIES: Check for conflicting notice days, payment terms, or contradictory clauses within the document.
8. DETECT MISSING TERMS: Check for missing referenced exhibits (e.g. "Schedule A" referenced but not provided), missing party definitions, or undefined formulas.
`;

export async function analyzeLegalDocumentWithGemini(
  text: string,
  docTitle: string = 'Uploaded Legal Document',
  jurisdiction?: string
): Promise<DocumentAnalysis> {
  const ai = getGeminiClient();

  const prompt = `Analyze the following legal document thoroughly.
Document Title: ${docTitle}
Jurisdiction specified by user: ${jurisdiction || 'Not specified (infer from text if mentioned)'}

=== BEGIN DOCUMENT TEXT ===
${text}
=== END DOCUMENT TEXT ===

Extract comprehensive structured intelligence according to the specified schema:
- overview (title, type, parties, effectiveDate, expiryDate, jurisdiction, language, pageCount estimate, confidence)
- executiveSummary (plain-English breakdown: whatThisIs, whoIsInvolved, expectedResponsibilities, financialSummary, durationAndTerm, howTerminationWorks, failureConsequences, keyThingsToReview)
- clauses (all key clauses with category, originalText, plainExplanation, explain15, affects, attentionLevel, whyItMatters, section, page, and exact evidence quote)
- attentionItems (unusual obligations, one-sided terms, hidden fees, automatic renewals, liability, with what to clarify and advice)
- obligations (structured list of responsible party, deadline, trigger, frequency, amount, consequences, source clause)
- deadlines (extracted dates or relative deadlines like "30 days before renewal")
- financialItems (categorized as one-time, recurring, conditional, penalties, or variable)
- inconsistencies (any contradictory terms or timelines within the text)
- missingInformation (missing exhibits, dates, or undefined terms)
- lawyerQuestions (curated high-value questions for professional legal review)`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction: LEGAL_ANALYSIS_SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overview: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              type: { type: Type.STRING },
              parties: { type: Type.ARRAY, items: { type: Type.STRING } },
              effectiveDate: { type: Type.STRING, nullable: true },
              expiryDate: { type: Type.STRING, nullable: true },
              jurisdiction: { type: Type.STRING, nullable: true },
              language: { type: Type.STRING },
              pageCount: { type: Type.INTEGER },
              confidence: { type: Type.NUMBER },
            },
            required: ['title', 'type', 'parties', 'language', 'pageCount', 'confidence'],
          },
          executiveSummary: {
            type: Type.OBJECT,
            properties: {
              whatThisIs: { type: Type.STRING },
              whoIsInvolved: { type: Type.STRING },
              expectedResponsibilities: { type: Type.STRING },
              financialSummary: { type: Type.STRING },
              durationAndTerm: { type: Type.STRING },
              howTerminationWorks: { type: Type.STRING },
              failureConsequences: { type: Type.STRING },
              keyThingsToReview: { type: Type.STRING },
            },
            required: [
              'whatThisIs',
              'whoIsInvolved',
              'expectedResponsibilities',
              'financialSummary',
              'durationAndTerm',
              'howTerminationWorks',
              'failureConsequences',
              'keyThingsToReview',
            ],
          },
          clauses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                originalText: { type: Type.STRING },
                plainExplanation: { type: Type.STRING },
                explain15: { type: Type.STRING },
                affects: { type: Type.STRING },
                userObligation: { type: Type.STRING, nullable: true },
                otherPartyObligation: { type: Type.STRING, nullable: true },
                financialImpact: { type: Type.STRING, nullable: true },
                timeImpact: { type: Type.STRING, nullable: true },
                attentionLevel: { type: Type.STRING },
                whyItMatters: { type: Type.STRING },
                section: { type: Type.STRING },
                page: { type: Type.INTEGER },
                evidenceQuote: { type: Type.STRING },
              },
              required: ['id', 'title', 'category', 'originalText', 'plainExplanation', 'explain15', 'affects', 'attentionLevel', 'whyItMatters', 'section', 'page', 'evidenceQuote'],
            },
          },
          attentionItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                attentionLevel: { type: Type.STRING },
                detectedIssue: { type: Type.STRING },
                whyItDeservesAttention: { type: Type.STRING },
                whatUserShouldClarify: { type: Type.STRING },
                professionalReviewAdvice: { type: Type.STRING },
                section: { type: Type.STRING },
                page: { type: Type.INTEGER },
                evidenceQuote: { type: Type.STRING },
              },
              required: ['id', 'title', 'category', 'attentionLevel', 'detectedIssue', 'whyItDeservesAttention', 'whatUserShouldClarify', 'professionalReviewAdvice', 'section', 'page', 'evidenceQuote'],
            },
          },
          obligations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                responsibleParty: { type: Type.STRING },
                deadline: { type: Type.STRING },
                trigger: { type: Type.STRING },
                frequency: { type: Type.STRING },
                amount: { type: Type.STRING, nullable: true },
                consequence: { type: Type.STRING },
                sourceClause: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                evidenceQuote: { type: Type.STRING },
                page: { type: Type.INTEGER },
              },
              required: ['id', 'title', 'responsibleParty', 'deadline', 'trigger', 'frequency', 'consequence', 'sourceClause', 'confidence', 'evidenceQuote', 'page'],
            },
          },
          deadlines: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                dateOrTimeline: { type: Type.STRING },
                isRelative: { type: Type.BOOLEAN },
                relativeReference: { type: Type.STRING, nullable: true },
                significance: { type: Type.STRING },
                page: { type: Type.INTEGER },
                section: { type: Type.STRING },
                evidenceQuote: { type: Type.STRING },
              },
              required: ['id', 'title', 'dateOrTimeline', 'isRelative', 'significance', 'page', 'section', 'evidenceQuote'],
            },
          },
          financialItems: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                label: { type: Type.STRING },
                amount: { type: Type.STRING },
                currency: { type: Type.STRING },
                timingType: { type: Type.STRING },
                description: { type: Type.STRING },
                evidenceQuote: { type: Type.STRING },
                page: { type: Type.INTEGER },
                section: { type: Type.STRING },
              },
              required: ['id', 'label', 'amount', 'currency', 'timingType', 'description', 'evidenceQuote', 'page', 'section'],
            },
          },
          inconsistencies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                provisionA: {
                  type: Type.OBJECT,
                  properties: {
                    section: { type: Type.STRING },
                    page: { type: Type.INTEGER },
                    text: { type: Type.STRING },
                  },
                  required: ['section', 'page', 'text'],
                },
                provisionB: {
                  type: Type.OBJECT,
                  properties: {
                    section: { type: Type.STRING },
                    page: { type: Type.INTEGER },
                    text: { type: Type.STRING },
                  },
                  required: ['section', 'page', 'text'],
                },
                whyInconsistent: { type: Type.STRING },
                recommendation: { type: Type.STRING },
              },
              required: ['id', 'title', 'description', 'provisionA', 'provisionB', 'whyInconsistent', 'recommendation'],
            },
          },
          missingInformation: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                missingElement: { type: Type.STRING },
                whyImportant: { type: Type.STRING },
                recommendation: { type: Type.STRING },
              },
              required: ['id', 'title', 'category', 'missingElement', 'whyImportant', 'recommendation'],
            },
          },
          lawyerQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                rationale: { type: Type.STRING },
                relatedSection: { type: Type.STRING },
                priority: { type: Type.STRING },
              },
              required: ['id', 'question', 'rationale', 'relatedSection', 'priority'],
            },
          },
        },
        required: [
          'overview',
          'executiveSummary',
          'clauses',
          'attentionItems',
          'obligations',
          'deadlines',
          'financialItems',
          'inconsistencies',
          'missingInformation',
          'lawyerQuestions',
        ],
      },
    },
  });

  const parsed = JSON.parse(response.text || '{}');
  const docId = `doc_${Date.now()}`;

  // Hydrate evidence objects cleanly
  const analysis: DocumentAnalysis = {
    overview: {
      ...parsed.overview,
      id: docId,
      analysisTimestamp: new Date().toISOString(),
      rawText: text,
    },
    executiveSummary: parsed.executiveSummary,
    clauses: (parsed.clauses || []).map((c: any, index: number) => ({
      id: c.id || `c_${index}`,
      title: c.title,
      category: c.category,
      originalText: c.originalText,
      plainExplanation: c.plainExplanation,
      explain15: c.explain15 || c.plainExplanation,
      affects: c.affects,
      userObligation: c.userObligation,
      otherPartyObligation: c.otherPartyObligation,
      financialImpact: c.financialImpact,
      timeImpact: c.timeImpact,
      attentionLevel: c.attentionLevel || 'Review',
      whyItMatters: c.whyItMatters,
      page: c.page || 1,
      section: c.section || 'General',
      evidence: {
        documentId: docId,
        documentName: docTitle,
        page: c.page || 1,
        section: c.section || 'General',
        sourceText: c.evidenceQuote || c.originalText,
        confidence: 0.95,
      },
    })),
    attentionItems: (parsed.attentionItems || []).map((a: any, index: number) => ({
      id: a.id || `att_${index}`,
      title: a.title,
      category: a.category,
      attentionLevel: a.attentionLevel || 'Important',
      detectedIssue: a.detectedIssue,
      whyItDeservesAttention: a.whyItDeservesAttention,
      whatUserShouldClarify: a.whatUserShouldClarify,
      professionalReviewAdvice: a.professionalReviewAdvice,
      evidence: {
        documentId: docId,
        documentName: docTitle,
        page: a.page || 1,
        section: a.section || 'Section',
        sourceText: a.evidenceQuote || a.detectedIssue,
        confidence: 0.94,
      },
    })),
    obligations: (parsed.obligations || []).map((o: any, index: number) => ({
      id: o.id || `ob_${index}`,
      title: o.title,
      responsibleParty: o.responsibleParty,
      deadline: o.deadline,
      trigger: o.trigger,
      frequency: o.frequency || 'One-time',
      amount: o.amount,
      consequence: o.consequence,
      sourceClause: o.sourceClause,
      confidence: o.confidence || 0.95,
      completed: false,
      evidence: {
        documentId: docId,
        documentName: docTitle,
        page: o.page || 1,
        section: o.sourceClause || 'Obligation',
        sourceText: o.evidenceQuote || o.title,
        confidence: o.confidence || 0.95,
      },
    })),
    deadlines: (parsed.deadlines || []).map((d: any, index: number) => ({
      id: d.id || `dl_${index}`,
      title: d.title,
      dateOrTimeline: d.dateOrTimeline,
      isRelative: Boolean(d.isRelative),
      relativeReference: d.relativeReference,
      significance: d.significance,
      page: d.page || 1,
      section: d.section || 'General',
      evidence: {
        documentId: docId,
        documentName: docTitle,
        page: d.page || 1,
        section: d.section || 'General',
        sourceText: d.evidenceQuote || d.dateOrTimeline,
        confidence: 0.95,
      },
    })),
    financialItems: (parsed.financialItems || []).map((f: any, index: number) => ({
      id: f.id || `fin_${index}`,
      label: f.label,
      amount: f.amount,
      currency: f.currency || 'USD',
      timingType: f.timingType || 'recurring',
      description: f.description,
      evidence: {
        documentId: docId,
        documentName: docTitle,
        page: f.page || 1,
        section: f.section || 'Financials',
        sourceText: f.evidenceQuote || f.label,
        confidence: 0.96,
      },
    })),
    inconsistencies: parsed.inconsistencies || [],
    missingInformation: parsed.missingInformation || [],
    lawyerQuestions: parsed.lawyerQuestions || [],
  };

  return analysis;
}

/**
 * Question Answering with Grounded Evidence Retrieval
 */
export async function answerQuestionWithGemini(
  question: string,
  docName: string,
  docText: string,
  docId: string
): Promise<QAAnswer> {
  const ai = getGeminiClient();

  // 1. Chunk document
  const chunks = chunkLegalDocument(docText, docId, docName);
  // 2. Retrieve top candidate chunks
  const retrieved = retrieveRelevantChunks(question, chunks, 6);

  const contextBlocks = retrieved
    .map(
      (r, i) =>
        `[CHUNK ${i + 1}] Section: ${r.chunk.section} | Page: ${r.chunk.page}\n"${r.chunk.text}"`
    )
    .join('\n\n');

  const prompt = `User Question: "${question}"

RELEVANT DOCUMENT EXCERPTS:
${contextBlocks}

INSTRUCTIONS:
1. Answer strictly based on the provided excerpts.
2. If the excerpts do NOT contain enough information, state clearly: "I could not find enough information in the provided document to answer that reliably."
3. Distinguish clearly between Document Fact (what the text verbatim says) and AI Interpretation.
4. If appropriate, suggest what to review with a qualified lawyer.
5. Provide exact quotations in the evidence array.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction: LEGAL_ANALYSIS_SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          answer: { type: Type.STRING },
          confidence: { type: Type.STRING }, // High | Medium | Low
          documentFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
          aiInterpretation: { type: Type.STRING },
          reviewSuggested: { type: Type.STRING, nullable: true },
          relatedClauses: { type: Type.ARRAY, items: { type: Type.STRING } },
          citations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                section: { type: Type.STRING },
                page: { type: Type.INTEGER },
                quote: { type: Type.STRING },
              },
              required: ['section', 'page', 'quote'],
            },
          },
        },
        required: ['answer', 'confidence', 'documentFacts', 'aiInterpretation', 'relatedClauses', 'citations'],
      },
    },
  });

  const parsed = JSON.parse(response.text || '{}');

  return {
    question,
    answer: parsed.answer || 'Unable to generate response.',
    confidence: (parsed.confidence as 'High' | 'Medium' | 'Low') || 'Medium',
    documentFacts: parsed.documentFacts || [],
    aiInterpretation: parsed.aiInterpretation || '',
    reviewSuggested: parsed.reviewSuggested || undefined,
    relatedClauses: parsed.relatedClauses || [],
    evidence: (parsed.citations || []).map((c: any) => ({
      documentId: docId,
      documentName: docName,
      page: c.page || 1,
      section: c.section || 'General',
      sourceText: c.quote,
      confidence: 0.95,
    })),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Compare two document versions with semantic diff & impact detection
 */
export async function compareDocumentsWithGemini(
  docAName: string,
  docAText: string,
  docBName: string,
  docBText: string
): Promise<ComparisonResult> {
  const ai = getGeminiClient();

  const prompt = `Perform a rigorous comparative legal analysis between two versions of a contract:

=== DOCUMENT A (BASE / VERSION 1): ${docAName} ===
${docAText}

=== DOCUMENT B (REVISED / VERSION 2): ${docBName} ===
${docBText}

Identify all substantive legal and commercial differences:
- Pricing and payment modifications
- Term duration and renewal changes
- Termination rights and notice windows
- Liability ceilings and indemnification changes
- Rights, restrictions, and warranties

Do NOT simply mark everything as "worse" or "better"; explain the practical operational and financial significance factually.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction: LEGAL_ANALYSIS_SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overviewSummary: { type: Type.STRING },
          stats: {
            type: Type.OBJECT,
            properties: {
              totalChanges: { type: Type.INTEGER },
              addedCount: { type: Type.INTEGER },
              removedCount: { type: Type.INTEGER },
              modifiedCount: { type: Type.INTEGER },
              unchangedCount: { type: Type.INTEGER },
              financialChanges: { type: Type.INTEGER },
              deadlineChanges: { type: Type.INTEGER },
              obligationChanges: { type: Type.INTEGER },
              terminationChanges: { type: Type.INTEGER },
            },
            required: [
              'totalChanges',
              'addedCount',
              'removedCount',
              'modifiedCount',
              'unchangedCount',
              'financialChanges',
              'deadlineChanges',
              'obligationChanges',
              'terminationChanges',
            ],
          },
          differences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                changeType: { type: Type.STRING }, // added | removed | modified | unchanged
                beforeText: { type: Type.STRING, nullable: true },
                afterText: { type: Type.STRING, nullable: true },
                summary: { type: Type.STRING },
                practicalSignificance: { type: Type.STRING },
                financialImpact: { type: Type.STRING, nullable: true },
                attentionLevel: { type: Type.STRING }, // Informational | Review | Important | High Attention
                sectionBefore: { type: Type.STRING, nullable: true },
                sectionAfter: { type: Type.STRING, nullable: true },
                pageBefore: { type: Type.INTEGER, nullable: true },
                pageAfter: { type: Type.INTEGER, nullable: true },
              },
              required: ['id', 'title', 'category', 'changeType', 'summary', 'practicalSignificance', 'attentionLevel'],
            },
          },
        },
        required: ['overviewSummary', 'stats', 'differences'],
      },
    },
  });

  const parsed = JSON.parse(response.text || '{}');

  return {
    docAId: 'doc_v1',
    docAName,
    docBId: 'doc_v2',
    docBName,
    overviewSummary: parsed.overviewSummary,
    stats: parsed.stats,
    differences: (parsed.differences || []).map((diff: any) => ({
      id: diff.id,
      title: diff.title,
      category: diff.category,
      changeType: diff.changeType,
      beforeText: diff.beforeText || undefined,
      afterText: diff.afterText || undefined,
      summary: diff.summary,
      practicalSignificance: diff.practicalSignificance,
      financialImpact: diff.financialImpact || undefined,
      attentionLevel: diff.attentionLevel || 'Review',
      evidenceBefore: diff.beforeText
        ? {
            documentId: 'doc_v1',
            documentName: docAName,
            page: diff.pageBefore || 1,
            section: diff.sectionBefore || 'Section',
            sourceText: diff.beforeText,
            confidence: 0.95,
          }
        : undefined,
      evidenceAfter: diff.afterText
        ? {
            documentId: 'doc_v2',
            documentName: docBName,
            page: diff.pageAfter || 1,
            section: diff.sectionAfter || 'Section',
            sourceText: diff.afterText,
            confidence: 0.95,
          }
        : undefined,
    })),
  };
}
