export interface DocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  page: number;
  section: string;
  clauseNumber?: string;
  text: string;
}

export interface RetrievalResult {
  chunk: DocumentChunk;
  score: number;
}

/**
 * Intelligent legal document chunker.
 * Splits document text by legal headings, numbered sections (e.g., 1. PREMISES, Section 4),
 * and paragraph boundaries rather than arbitrary character splits.
 */
export function chunkLegalDocument(
  text: string,
  documentId: string,
  documentName: string
): DocumentChunk[] {
  const lines = text.split('\n');
  const chunks: DocumentChunk[] = [];
  
  let currentSection = 'Introduction / Preamble';
  let currentParagraphs: string[] = [];
  let pageNumber = 1;
  let chunkIndex = 0;
  let charAccumulator = 0;

  // Approximate page estimation based on standard ~2500 characters per double-spaced legal page
  const updatePage = (addedLength: number) => {
    charAccumulator += addedLength;
    pageNumber = Math.max(1, Math.floor(charAccumulator / 2200) + 1);
  };

  const flushCurrent = () => {
    if (currentParagraphs.length > 0) {
      const chunkText = currentParagraphs.join('\n').trim();
      if (chunkText.length > 20) {
        chunkIndex++;
        chunks.push({
          id: `${documentId}_chunk_${chunkIndex}`,
          documentId,
          documentName,
          page: pageNumber,
          section: currentSection,
          text: chunkText
        });
      }
      currentParagraphs = [];
    }
  };

  const sectionHeadingRegex = /^(?:SECTION\s+\d+|CLAUSE\s+\d+|\d+\.|\d+\))\s+([A-Z0-9\s,&/\-]+)/i;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      // Empty line can be paragraph boundary
      if (currentParagraphs.join('\n').length > 500) {
        flushCurrent();
      }
      continue;
    }

    const match = line.match(sectionHeadingRegex);
    if (match) {
      // New legal clause / section detected
      flushCurrent();
      currentSection = line;
      currentParagraphs.push(line);
      updatePage(line.length);
    } else {
      currentParagraphs.push(line);
      updatePage(line.length);
      // Keep individual chunks under ~1000 characters for tight citation mapping
      if (currentParagraphs.join('\n').length > 1200) {
        flushCurrent();
      }
    }
  }

  flushCurrent();
  return chunks;
}

/**
 * Fast BM25-inspired keyword and token retrieval to score candidate chunks
 * for grounded question answering and citation pinpointing.
 */
export function retrieveRelevantChunks(
  query: string,
  chunks: DocumentChunk[],
  topK: number = 5
): RetrievalResult[] {
  const queryTokens = query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);

  if (queryTokens.length === 0) {
    return chunks.slice(0, topK).map(c => ({ chunk: c, score: 0.5 }));
  }

  const scored = chunks.map(chunk => {
    const chunkLower = chunk.text.toLowerCase();
    const sectionLower = chunk.section.toLowerCase();

    let score = 0;
    for (const token of queryTokens) {
      // Match in section heading gets bonus
      if (sectionLower.includes(token)) {
        score += 3.0;
      }
      // Exact substring matches in text
      const occurrences = (chunkLower.match(new RegExp(`\\b${token}\\b`, 'g')) || []).length;
      score += occurrences * 1.5;

      if (chunkLower.includes(token)) {
        score += 0.5;
      }
    }

    // Normalized by text length factor to avoid bias purely to long paragraphs
    const lengthPenalty = Math.log(chunk.text.length + 10) / 7;
    const finalScore = score / (lengthPenalty || 1);

    return {
      chunk,
      score: finalScore
    };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
