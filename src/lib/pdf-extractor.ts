/**
 * Cryptographic SHA-256 hash generation and PDF text extraction.
 * Operates client-side using standard Web Crypto API.
 */

export async function calculateFileHash(file: File | Blob): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export interface ExtractedPdfData {
  text: string;
  pageCount: number;
  extractedNoticeId?: string;
  extractedDates: string[];
  extractedVenue?: string;
  extractedTitle?: string;
  isScannedOrImageOnly: boolean;
}

/**
 * Extracts embedded text and metadata from PDF files using pdfjs-dist or robust stream parser.
 */
export async function extractPdfText(file: File): Promise<ExtractedPdfData> {
  try {
    // Dynamic import to keep initial bundle light and avoid SSR/worker issues
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker src if available or fallback
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    const pageCount = pdf.numPages;

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');
      fullText += pageText + '\n';
    }

    const trimmed = fullText.trim();
    const isScannedOrImageOnly = trimmed.length < 30; // Very little embedded text indicates scanned image PDF

    // Parse structured entities
    const noticeIdMatch = trimmed.match(/NT-\d{4}-[A-Z]+-\d+/i) || trimmed.match(/NT-[A-Z0-9-]+/i);
    const extractedNoticeId = noticeIdMatch ? noticeIdMatch[0].toUpperCase() : undefined;

    // Date extraction patterns: e.g., "Nov 15, 2026", "15/11/2026", "2026-11-15", "November 10, 2026"
    const dateMatches = trimmed.match(/(?:\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b|\b\d{1,2}(?:st|nd|rd|th)? (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b)/gi) || [];

    // Venue extraction pattern: "Venue: [XYZ]", "Hall [A-Z]", "Auditorium [A-Z]"
    const venueMatch = trimmed.match(/(?:Venue|Location|Room|Hall|Auditorium)[:\s]+([^\n\r,;.]+)/i);
    const extractedVenue = venueMatch ? venueMatch[1].trim() : undefined;

    // Title estimation: first non-empty lines that don't look like generic header
    const lines = trimmed.split('\n').map(l => l.trim()).filter(l => l.length > 5);
    const extractedTitle = lines.length > 1 ? lines[1] : lines[0];

    return {
      text: trimmed,
      pageCount,
      extractedNoticeId,
      extractedDates: Array.from(new Set(dateMatches)),
      extractedVenue,
      extractedTitle,
      isScannedOrImageOnly
    };
  } catch (err) {
    console.warn('PDF.js parse failed, attempting fallback text extraction:', err);
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const rawContent = decoder.decode(arrayBuffer);

    const noticeIdMatch = rawContent.match(/NT-\d{4}-[A-Z]+-\d+/i) || rawContent.match(/NT-[A-Z0-9-]+/i);
    const extractedNoticeId = noticeIdMatch ? noticeIdMatch[0].toUpperCase() : undefined;

    const dateMatches = rawContent.match(/(?:\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b|\b\d{1,2}(?:st|nd|rd|th)? (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{4}\b)/gi) || [];
    const venueMatch = rawContent.match(/(?:Venue|Location|Room|Hall|Auditorium)[:\s]+([^\n\r,;.]+)/i);
    const extractedVenue = venueMatch ? venueMatch[1].trim() : undefined;

    return {
      text: rawContent,
      pageCount: 1,
      extractedNoticeId,
      extractedDates: Array.from(new Set(dateMatches)),
      extractedVenue,
      isScannedOrImageOnly: !extractedNoticeId && rawContent.length < 30
    };
  }
}
