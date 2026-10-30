import { Notice, NoticeConflict, NoticeVersion } from '../types';

export interface PotentialConflictCandidate {
  noticeA: Notice;
  versionA: NoticeVersion;
  noticeB: Notice;
  versionB: NoticeVersion;
  conflictType: 'venue_clash' | 'exam_date_overlap' | 'conflicting_deadline' | 'duplicate_content';
  conflictingFields: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
}

function parseTime(dateStr?: string): number | null {
  if (!dateStr) return null;
  const t = new Date(dateStr).getTime();
  return isNaN(t) ? null : t;
}

function isSameDay(t1: number, t2: number): boolean {
  const d1 = new Date(t1);
  const d2 = new Date(t2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

/**
 * Evaluates active and approved notices across the institution to identify scheduling collisions and conflicting data.
 */
export function scanCrossNoticeConflicts(notices: Notice[]): PotentialConflictCandidate[] {
  const candidates: PotentialConflictCandidate[] = [];
  
  // Filter only active or approved notices with current versions
  const activeNotices = notices.filter(n => 
    ['active', 'approved', 'upcoming'].includes(n.status) && n.current_version
  );

  for (let i = 0; i < activeNotices.length; i++) {
    for (let j = i + 1; j < activeNotices.length; j++) {
      const nA = activeNotices[i];
      const nB = activeNotices[j];
      const vA = nA.current_version!;
      const vB = nB.current_version!;

      // Notice must belong to same institution
      if (nA.institution_id !== nB.institution_id) continue;

      // 1. VENUE CLASH: Both notices specify the exact same venue on the same day/time
      const vTimeA = parseTime(vA.exam_date || vA.event_date);
      const vTimeB = parseTime(vB.exam_date || vB.event_date);

      if (vA.venue && vB.venue && vTimeA && vTimeB) {
        const venueA = vA.venue.trim().toLowerCase();
        const venueB = vB.venue.trim().toLowerCase();

        if (venueA === venueB && isSameDay(vTimeA, vTimeB)) {
          candidates.push({
            noticeA: nA,
            versionA: vA,
            noticeB: nB,
            versionB: vB,
            conflictType: 'venue_clash',
            conflictingFields: {
              venue: vA.venue,
              dateA: new Date(vTimeA).toLocaleString(),
              dateB: new Date(vTimeB).toLocaleString(),
              departmentA: nA.department,
              departmentB: nB.department,
              semesterA: nA.semester,
              semesterB: nB.semester
            },
            severity: 'critical',
            reason: `Direct Venue Clash: Both notices allocate "${vA.venue}" on the same date (${new Date(vTimeA).toLocaleDateString()}).`
          });
          continue; // Avoid duplicate alerts for same pair
        }
      }

      // 2. EXAM DATE OVERLAP FOR SAME COHORT
      const isSameAudience = (nA.department === nB.department || nA.department === 'All Departments' || nB.department === 'All Departments') &&
                             (nA.semester === nB.semester || nA.semester === 'All' || nB.semester === 'All');

      if (isSameAudience && vA.exam_date && vB.exam_date) {
        const examTimeA = parseTime(vA.exam_date);
        const examTimeB = parseTime(vB.exam_date);

        if (examTimeA && examTimeB && isSameDay(examTimeA, examTimeB)) {
          candidates.push({
            noticeA: nA,
            versionA: vA,
            noticeB: nB,
            versionB: vB,
            conflictType: 'exam_date_overlap',
            conflictingFields: {
              examA: vA.title,
              examB: vB.title,
              dateA: new Date(examTimeA).toLocaleString(),
              dateB: new Date(examTimeB).toLocaleString(),
              department: nA.department,
              semester: nA.semester
            },
            severity: 'high',
            reason: `Conflicting Examination Schedule: Both exams are assigned on ${new Date(examTimeA).toLocaleDateString()} for ${nA.department} (${nA.semester}).`
          });
          continue;
        }
      }

      // 3. DUPLICATE CONTENT OR TITLE OVERLAP
      const titleA = vA.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      const titleB = vB.title.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (titleA.length > 15 && (titleA.includes(titleB) || titleB.includes(titleA))) {
        candidates.push({
          noticeA: nA,
          versionA: vA,
          noticeB: nB,
          versionB: vB,
          conflictType: 'duplicate_content',
          conflictingFields: {
            titleA: vA.title,
            titleB: vB.title,
            publishedByA: nA.created_by,
            publishedByB: nB.created_by
          },
          severity: 'medium',
          reason: `Potential Duplicate Notice: High lexical title similarity detected between Notice ${nA.notice_id} and ${nB.notice_id}.`
        });
      }
    }
  }

  return candidates;
}
