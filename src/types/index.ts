export * from './database.types';

export interface NoticeFilterParams {
  searchQuery?: string;
  institutionId?: string;
  department?: string;
  category?: string;
  semester?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface StructuredDiffResult {
  hasChanges: boolean;
  fieldChanges: {
    field: string;
    label: string;
    oldValue: any;
    newValue: any;
    isCritical: boolean; // exam date, venue, deadline
  }[];
  textSummary: string[];
}

export interface ConflictRadarAlert {
  id: string;
  noticeA: {
    id: string;
    noticeId: string;
    title: string;
    date?: string;
    venue?: string;
  };
  noticeB: {
    id: string;
    noticeId: string;
    title: string;
    date?: string;
    venue?: string;
  };
  conflictType: string;
  conflictingFields: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'confirmed' | 'resolved' | 'false_positive';
}

export interface VerificationEvaluation {
  status: 'exact_match_current' | 'older_superseded_version' | 'possible_mismatch' | 'potential_conflict' | 'unable_to_verify';
  confidence: number;
  matchedNotice?: any;
  matchedVersion?: any;
  currentApprovedVersion?: any;
  extractedNoticeId?: string;
  extractedTitle?: string;
  extractedDates?: string[];
  extractedVenue?: string;
  fileHash: string;
  exactHashMatch: boolean;
  differences: string[];
  explanation: string;
  isPdfTextExtracted: boolean;
  isOcrRequired: boolean;
}
