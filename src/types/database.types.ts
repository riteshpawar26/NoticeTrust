export type UserRole = 'student' | 'publisher' | 'admin' | 'super_admin';

export type NoticeStatus = 
  | 'draft' 
  | 'pending_review' 
  | 'approved' 
  | 'upcoming' 
  | 'active' 
  | 'expired' 
  | 'cancelled' 
  | 'superseded';

export type VersionReviewStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'superseded';

export type ConflictType = 
  | 'exam_date_overlap' 
  | 'venue_clash' 
  | 'conflicting_deadline' 
  | 'duplicate_content';

export type ConflictSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ConflictStatus = 'detected' | 'confirmed' | 'resolved' | 'false_positive';

export type AuthenticityStatus = 
  | 'exact_match_current' 
  | 'older_superseded_version' 
  | 'possible_mismatch' 
  | 'potential_conflict' 
  | 'unable_to_verify';

export type ReportType = 
  | 'outdated' 
  | 'suspicious_altered' 
  | 'duplicate' 
  | 'conflicting' 
  | 'incorrect_info' 
  | 'broken_link' 
  | 'other';

export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';

export type NotificationType = 
  | 'revision' 
  | 'cancellation' 
  | 'deadline' 
  | 'conflict_resolution' 
  | 'approval' 
  | 'report_update';

export interface Institution {
  id: string;
  name: string;
  code: string;
  domain?: string;
  address?: string;
  logo_url?: string;
  timezone: string;
  contact_email?: string;
  is_verified: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  institution_id?: string;
  department?: string;
  semester?: string;
  student_id?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  institution?: Institution;
}

export interface PublisherPermission {
  id: string;
  user_id: string;
  institution_id: string;
  department?: string;
  allowed_categories: string[];
  can_publish_without_approval: boolean;
  granted_by?: string;
  created_at: string;
}

export interface NoticeAttachment {
  id: string;
  version_id: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  sha256_hash: string;
  extracted_text?: string;
  is_primary: boolean;
  created_at: string;
}

export interface NoticeVersion {
  id: string;
  notice_id: string;
  version_number: number;
  title: string;
  description?: string;
  event_date?: string;
  exam_date?: string;
  deadline?: string;
  effective_date: string;
  expiry_date?: string;
  venue?: string;
  target_audience?: string;
  changes_summary?: string;
  created_by: string;
  reviewer_id?: string;
  review_status: VersionReviewStatus;
  review_feedback?: string;
  reviewed_at?: string;
  cancellation_reason?: string;
  cancelled_at?: string;
  file_hash?: string;
  created_at: string;
  creator?: Profile;
  reviewer?: Profile;
  attachments?: NoticeAttachment[];
}

export interface Notice {
  id: string;
  notice_id: string; // e.g., NT-2026-EXAM-0101
  institution_id: string;
  category: string;
  department: string;
  semester: string;
  current_version_id?: string;
  status: NoticeStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  institution?: Institution;
  current_version?: NoticeVersion;
  versions?: NoticeVersion[];
  creator?: Profile;
  is_saved?: boolean;
}

export interface NoticeReport {
  id: string;
  notice_id: string;
  version_id?: string;
  reporter_id: string;
  report_type: ReportType;
  description: string;
  status: ReportStatus;
  reviewer_id?: string;
  resolution_notes?: string;
  resolved_at?: string;
  created_at: string;
  notice?: Notice;
  reporter?: Profile;
  reviewer?: Profile;
}

export interface ModerationAction {
  id: string;
  notice_id: string;
  version_id?: string;
  reviewer_id: string;
  action_type: 'approve' | 'reject' | 'request_changes' | 'cancel' | 'supersede' | 'resolve_conflict';
  reason?: string;
  previous_status?: string;
  new_status?: string;
  created_at: string;
  reviewer?: Profile;
}

export interface SavedNotice {
  id: string;
  user_id: string;
  notice_id: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  institution_id: string;
  department?: string;
  category?: string;
  notify_revisions: boolean;
  notify_cancellations: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_email?: string;
  action_type: string;
  target_type: string;
  target_id?: string;
  correlation_id?: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  created_at: string;
  actor?: Profile;
}

export interface NoticeConflict {
  id: string;
  notice_a_id: string;
  version_a_id: string;
  notice_b_id: string;
  version_b_id: string;
  conflict_type: ConflictType;
  conflicting_fields: Record<string, any>;
  severity: ConflictSeverity;
  status: ConflictStatus;
  detected_at: string;
  resolved_by?: string;
  resolution_notes?: string;
  resolved_at?: string;
  notice_a?: Notice;
  version_a?: NoticeVersion;
  notice_b?: Notice;
  version_b?: NoticeVersion;
  resolver?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  notice_id?: string;
  is_read: boolean;
  created_at: string;
  notice?: Notice;
}

export interface AuthenticityCheck {
  id: string;
  user_id?: string;
  file_name?: string;
  file_hash?: string;
  extracted_text_snippet?: string;
  detected_notice_id?: string;
  result_status: AuthenticityStatus;
  matched_notice_id?: string;
  matched_version_id?: string;
  match_confidence?: number;
  detected_differences?: Record<string, any>;
  notes?: string;
  created_at: string;
  matched_notice?: Notice;
  matched_version?: NoticeVersion;
}
