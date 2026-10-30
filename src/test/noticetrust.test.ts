import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../lib/db';
import { compareNoticeVersions } from '../lib/revision-diff';
import { scanCrossNoticeConflicts } from '../lib/conflict-radar';
import { calculateFileHash } from '../lib/pdf-extractor';
import { verifyUploadedNotice } from '../lib/authenticity';

describe('NoticeTrust Core Business Logic & Innovations', () => {
  beforeEach(() => {
    // Reset to factory state before each test
    db.resetToDefault();
  });

  describe('1. Institutional Registry & Seed Scenarios', () => {
    it('initializes institution and demo profiles across all 4 roles', () => {
      const institution = db.getInstitution();
      expect(institution.code).toBe('NIET-TECH');
      expect(institution.is_verified).toBe(true);

      const profiles = db.getProfiles();
      expect(profiles.some(p => p.role === 'student')).toBe(true);
      expect(profiles.some(p => p.role === 'publisher')).toBe(true);
      expect(profiles.some(p => p.role === 'admin')).toBe(true);
      expect(profiles.some(p => p.role === 'super_admin')).toBe(true);
    });

    it('loads seed notices with immutable version chains and status', () => {
      const { notices } = db.getNotices();
      expect(notices.length).toBeGreaterThanOrEqual(5);

      const examNotice = db.getNoticeByNoticeId('NT-2026-EXAM-0101');
      expect(examNotice).toBeDefined();
      expect(examNotice?.versions?.length).toBe(2);
      expect(examNotice?.current_version?.version_number).toBe(2);

      const cancelledNotice = db.getNoticeByNoticeId('NT-2026-EVT-0412');
      expect(cancelledNotice?.status).toBe('cancelled');
      expect(cancelledNotice?.current_version?.cancellation_reason).toBeTruthy();
    });
  });

  describe('2. Separation of Duties & Lifecycle Transitions', () => {
    it('prevents a publisher from approving their own notice submission', () => {
      const publisherId = 'b3000000-0000-0000-0000-000000000003';
      const draft = db.createNoticeDraft({
        title: 'Mid-Semester Lab Viva',
        description: 'Schedule for CSE batch.',
        category: 'Examination',
        department: 'Computer Science & Engineering',
        effective_date: new Date().toISOString(),
        publisher_id: publisherId
      });

      expect(draft.status).toBe('pending_review');

      // Attempting to approve as the creator must throw separation of duties violation
      expect(() => {
        db.approveNoticeVersion(draft.id, draft.current_version_id!, publisherId);
      }).toThrow(/Separation of duties violation/);
    });

    it('allows authorized admin reviewer to approve draft notice', () => {
      const publisherId = 'b3000000-0000-0000-0000-000000000003';
      const adminReviewerId = 'b2000000-0000-0000-0000-000000000002';

      const draft = db.createNoticeDraft({
        title: 'Algorithms Seminar',
        description: 'Guest lecture on advanced graph algorithms.',
        category: 'Events',
        department: 'Computer Science & Engineering',
        effective_date: new Date().toISOString(),
        publisher_id: publisherId
      });

      const approved = db.approveNoticeVersion(draft.id, draft.current_version_id!, adminReviewerId, 'Senate Approved');
      expect(approved.status).toBe('active');
      expect(approved.current_version?.review_status).toBe('approved');
      expect(approved.current_version?.reviewer_id).toBe(adminReviewerId);
    });

    it('preserves historical version as superseded when revision is approved', () => {
      const notice = db.getNoticeByNoticeId('NT-2026-EXAM-0101')!;
      const v1 = notice.versions?.find(v => v.version_number === 1);
      const v2 = notice.versions?.find(v => v.version_number === 2);

      expect(v1?.review_status).toBe('superseded');
      expect(v2?.review_status).toBe('approved');
      expect(notice.current_version_id).toBe(v2?.id);
    });
  });

  describe('3. Smart Revision Impact Detector', () => {
    it('identifies critical shifts in exam date and venue between versions', () => {
      const notice = db.getNoticeByNoticeId('NT-2026-EXAM-0101')!;
      const v1 = notice.versions?.find(v => v.version_number === 1)!;
      const v2 = notice.versions?.find(v => v.version_number === 2)!;

      const diff = compareNoticeVersions(v1, v2);
      expect(diff.hasChanges).toBe(true);
      expect(diff.criticalChangesCount).toBeGreaterThanOrEqual(2);

      const examDiff = diff.diffs.find(d => d.fieldName === 'exam_date');
      expect(examDiff).toBeDefined();
      expect(examDiff?.isCritical).toBe(true);

      const venueDiff = diff.diffs.find(d => d.fieldName === 'venue');
      expect(venueDiff).toBeDefined();
      expect(venueDiff?.isCritical).toBe(true);
    });
  });

  describe('4. Cross-Notice Conflict Radar', () => {
    it('detects venue collision when two notices book the same hall on the same day', () => {
      const { notices } = db.getNotices();
      const conflicts = scanCrossNoticeConflicts(notices);

      const venueClash = conflicts.find(c => c.conflictType === 'venue_clash');
      expect(venueClash).toBeDefined();
      expect(venueClash?.severity).toBe('critical');
      expect(venueClash?.conflictingFields.venue).toBe('Auditorium Complex - Hall B');
    });

    it('allows admin to resolve conflict with recorded explanation', () => {
      const conflicts = db.getConflicts();
      const first = conflicts[0];
      const adminId = 'b2000000-0000-0000-0000-000000000002';

      db.resolveConflict(first.id, adminId, 'resolved', 'Theory exam granted Auditorium B priority; Lab practical relocated to Lab 3.');
      const updated = db.getConflicts().find(c => c.id === first.id);
      expect(updated?.status).toBe('resolved');
      expect(updated?.resolution_notes).toContain('Auditorium B priority');
    });
  });

  describe('5. Cryptographic Hashing & Authenticity Checker', () => {
    it('calculates deterministic SHA-256 hash', async () => {
      const content = 'NoticeTrust Official Circular 2026';
      const blob = new Blob([content], { type: 'text/plain' });
      const hash1 = await calculateFileHash(blob);
      const hash2 = await calculateFileHash(blob);

      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(64); // 64 hex characters
    });

    it('verifies exact match to current approved notice when content aligns', async () => {
      const content = 'NATIONAL INSTITUTE OF ENGINEERING & TECHNOLOGY\nNOTICE ID: NT-2026-EXAM-0101 (REVISION 2)\nSubject: REVISED Distributed Systems Theory Examination\nDate: Nov 15, 2026. Venue: Auditorium Complex - Hall B';
      const file = new File([content], 'CS_Sem6_Exam_Schedule_v2_REVISED.pdf', { type: 'application/pdf' });

      const notices = db.getNotices().notices;
      const evaluation = await verifyUploadedNotice(file, notices);

      expect(evaluation.status).toBe('exact_match_current');
      expect(evaluation.matchedNotice?.notice_id).toBe('NT-2026-EXAM-0101');
    });

    it('flags an outdated notice that corresponds to an older superseded version', async () => {
      const content = 'NATIONAL INSTITUTE OF ENGINEERING & TECHNOLOGY\nNOTICE ID: NT-2026-EXAM-0101\nSubject: Distributed Systems Theory Examination\nDate: Nov 10, 2026. Venue: Hall A';
      const file = new File([content], 'WhatsApp_Forward_CS_Exam_Nov10.pdf', { type: 'application/pdf' });

      const notices = db.getNotices().notices;
      const evaluation = await verifyUploadedNotice(file, notices);

      expect(evaluation.status).toBe('older_superseded_version');
      expect(evaluation.explanation).toContain('OUTDATED');
    });

    it('returns unable_to_verify for unregistered document', async () => {
      const content = 'Generic flyer with no notice ID or institutional marks.';
      const file = new File([content], 'Unknown_Doc.pdf', { type: 'application/pdf' });

      const notices = db.getNotices().notices;
      const evaluation = await verifyUploadedNotice(file, notices);

      expect(evaluation.status).toBe('unable_to_verify');
      expect(evaluation.confidence).toBe(0);
    });
  });

  describe('6. Notice Cancellation & Reporting', () => {
    it('records mandatory cancellation reason when cancelling a notice', () => {
      const notice = db.getNoticeByNoticeId('NT-2026-SCH-0330')!;
      const adminId = 'b2000000-0000-0000-0000-000000000002';

      db.cancelNotice(notice.id, adminId, 'Scholarship fund reallocated by government order.');
      const updated = db.getNoticeById(notice.id)!;

      expect(updated.status).toBe('cancelled');
      expect(updated.current_version?.cancellation_reason).toContain('Scholarship fund reallocated');
    });

    it('allows students to file discrepancy reports and administrators to resolve them', () => {
      const studentId = 'b5000000-0000-0000-0000-000000000005';
      const adminId = 'b2000000-0000-0000-0000-000000000002';
      const notice = db.getNoticeByNoticeId('NT-2026-EXAM-0101')!;

      const report = db.submitNoticeReport({
        notice_id: notice.id,
        reporter_id: studentId,
        report_type: 'suspicious_altered',
        description: 'A forwarded screenshot is circulating showing exam at 2 PM instead of 10 AM.'
      });

      expect(report.status).toBe('pending');

      db.resolveReport(report.id, adminId, 'Confirmed 10 AM is authoritative. Issued clarification notification.', 'resolved');
      const resolved = db.getReports().find(r => r.id === report.id);
      expect(resolved?.status).toBe('resolved');
      expect(resolved?.resolution_notes).toContain('10 AM is authoritative');
    });
  });
});
