import { NoticeVersion } from '../types';

export interface FieldDiff {
  fieldName: string;
  fieldLabel: string;
  oldValue: string;
  newValue: string;
  isCritical: boolean; // dates, venues, deadlines
  changeType: 'modified' | 'added' | 'removed' | 'unchanged';
}

export interface VersionComparisonResult {
  oldVersionNumber: number;
  newVersionNumber: number;
  hasChanges: boolean;
  criticalChangesCount: number;
  diffs: FieldDiff[];
  summaryItems: string[];
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Not Specified';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Deterministically compares two notice versions and detects critical field shifts.
 */
export function compareNoticeVersions(oldVer: NoticeVersion, newVer: NoticeVersion): VersionComparisonResult {
  const diffs: FieldDiff[] = [];
  const summaryItems: string[] = [];
  let criticalCount = 0;

  // 1. Examination Date
  const oldExam = formatDate(oldVer.exam_date);
  const newExam = formatDate(newVer.exam_date);
  if (oldVer.exam_date !== newVer.exam_date) {
    criticalCount++;
    const diff: FieldDiff = {
      fieldName: 'exam_date',
      fieldLabel: 'Examination Date & Time',
      oldValue: oldExam,
      newValue: newExam,
      isCritical: true,
      changeType: !oldVer.exam_date ? 'added' : !newVer.exam_date ? 'removed' : 'modified'
    };
    diffs.push(diff);
    summaryItems.push(`Examination date changed from "${oldExam}" to "${newExam}"`);
  }

  // 2. Venue
  const oldVenue = oldVer.venue || '';
  const newVenue = newVer.venue || '';
  if (oldVenue !== newVenue) {
    criticalCount++;
    const diff: FieldDiff = {
      fieldName: 'venue',
      fieldLabel: 'Venue / Examination Hall',
      oldValue: oldVenue || 'Not Assigned',
      newValue: newVenue || 'Not Assigned',
      isCritical: true,
      changeType: !oldVenue ? 'added' : !newVenue ? 'removed' : 'modified'
    };
    diffs.push(diff);
    summaryItems.push(`Venue relocated from "${oldVenue || 'None'}" to "${newVenue || 'None'}"`);
  }

  // 3. Deadline / Last Date
  const oldDeadline = formatDate(oldVer.deadline);
  const newDeadline = formatDate(newVer.deadline);
  if (oldVer.deadline !== newVer.deadline) {
    criticalCount++;
    const diff: FieldDiff = {
      fieldName: 'deadline',
      fieldLabel: 'Submission / Application Deadline',
      oldValue: oldDeadline,
      newValue: newDeadline,
      isCritical: true,
      changeType: !oldVer.deadline ? 'added' : !newVer.deadline ? 'removed' : 'modified'
    };
    diffs.push(diff);
    summaryItems.push(`Deadline shifted from "${oldDeadline}" to "${newDeadline}"`);
  }

  // 4. Event Date
  const oldEvent = formatDate(oldVer.event_date);
  const newEvent = formatDate(newVer.event_date);
  if (oldVer.event_date !== newVer.event_date) {
    criticalCount++;
    const diff: FieldDiff = {
      fieldName: 'event_date',
      fieldLabel: 'Event Date',
      oldValue: oldEvent,
      newValue: newEvent,
      isCritical: true,
      changeType: !oldVer.event_date ? 'added' : !newVer.event_date ? 'removed' : 'modified'
    };
    diffs.push(diff);
    summaryItems.push(`Event date rescheduled from "${oldEvent}" to "${newEvent}"`);
  }

  // 5. Title
  if (oldVer.title !== newVer.title) {
    diffs.push({
      fieldName: 'title',
      fieldLabel: 'Notice Title',
      oldValue: oldVer.title,
      newValue: newVer.title,
      isCritical: false,
      changeType: 'modified'
    });
    summaryItems.push(`Title revised to "${newVer.title}"`);
  }

  // 6. Target Audience / Eligibility
  const oldAudience = oldVer.target_audience || '';
  const newAudience = newVer.target_audience || '';
  if (oldAudience !== newAudience) {
    diffs.push({
      fieldName: 'target_audience',
      fieldLabel: 'Target Audience / Cohort',
      oldValue: oldAudience || 'General',
      newValue: newAudience || 'General',
      isCritical: false,
      changeType: 'modified'
    });
    summaryItems.push(`Target audience updated to "${newAudience}"`);
  }

  // 7. Expiry Date
  const oldExpiry = formatDate(oldVer.expiry_date);
  const newExpiry = formatDate(newVer.expiry_date);
  if (oldVer.expiry_date !== newVer.expiry_date) {
    diffs.push({
      fieldName: 'expiry_date',
      fieldLabel: 'Validity / Expiry Date',
      oldValue: oldExpiry,
      newValue: newExpiry,
      isCritical: false,
      changeType: 'modified'
    });
    summaryItems.push(`Expiry date adjusted to "${newExpiry}"`);
  }

  // 8. Description / Body Text
  const oldDesc = oldVer.description || '';
  const newDesc = newVer.description || '';
  if (oldDesc !== newDesc) {
    diffs.push({
      fieldName: 'description',
      fieldLabel: 'Instructions & Notice Body',
      oldValue: oldDesc,
      newValue: newDesc,
      isCritical: false,
      changeType: 'modified'
    });
    summaryItems.push('Instructions and notice body description revised.');
  }

  return {
    oldVersionNumber: oldVer.version_number,
    newVersionNumber: newVer.version_number,
    hasChanges: diffs.length > 0,
    criticalChangesCount: criticalCount,
    diffs,
    summaryItems: summaryItems.length > 0 ? summaryItems : ['No structural metadata changes detected between versions.']
  };
}
