import { 
  Institution, 
  Profile, 
  Notice, 
  NoticeVersion, 
  NoticeReport, 
  ModerationAction, 
  NoticeConflict, 
  Notification, 
  AuditLog, 
  SavedNotice,
  NoticeFilterParams,
  PublisherPermission
} from '../types';
import { compareNoticeVersions } from './revision-diff';

const STORAGE_KEY = 'noticetrust_db_store_v1';

// Initial Demo Seed State
const INITIAL_INSTITUTION: Institution = {
  id: 'a1000000-0000-0000-0000-000000000001',
  name: 'National Institute of Engineering & Technology',
  code: 'NIET-TECH',
  domain: 'niet.edu.in',
  address: 'Innovation Tech Park, Sector 4, Pune, MH, India',
  timezone: 'Asia/Kolkata',
  contact_email: 'registrar@niet.edu.in',
  is_verified: true,
  created_at: new Date(Date.now() - 30 * 86400000).toISOString()
};

const INITIAL_PROFILES: Profile[] = [
  {
    id: 'b1000000-0000-0000-0000-000000000001',
    email: 'superadmin@noticetrust.edu',
    full_name: 'Dr. S. Radhakrishnan',
    role: 'super_admin',
    institution_id: INITIAL_INSTITUTION.id,
    department: 'Directorate',
    phone: '+91 98220 11001',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'b2000000-0000-0000-0000-000000000002',
    email: 'dean.academics@noticetrust.edu',
    full_name: 'Prof. Neha Verma (Dean Academics)',
    role: 'admin',
    institution_id: INITIAL_INSTITUTION.id,
    department: 'Academic Affairs',
    phone: '+91 98220 22002',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'b3000000-0000-0000-0000-000000000003',
    email: 'exam.controller@noticetrust.edu',
    full_name: 'Dr. Aris Thorne (Controller of Exams)',
    role: 'publisher',
    institution_id: INITIAL_INSTITUTION.id,
    department: 'Examination Cell',
    phone: '+91 98220 33003',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'b4000000-0000-0000-0000-000000000004',
    email: 'hod.cs@noticetrust.edu',
    full_name: 'Dr. Ramesh Gupta (HOD Computer Science)',
    role: 'publisher',
    institution_id: INITIAL_INSTITUTION.id,
    department: 'Computer Science & Engineering',
    phone: '+91 98220 44004',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'b5000000-0000-0000-0000-000000000005',
    email: 'priya.sharma@noticetrust.edu',
    full_name: 'Priya Sharma',
    role: 'student',
    institution_id: INITIAL_INSTITUTION.id,
    department: 'Computer Science & Engineering',
    semester: 'Semester 6',
    student_id: 'CS2023-8842',
    phone: '+91 98220 55005',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const INITIAL_PERMISSIONS: PublisherPermission[] = [
  {
    id: 'p1000000-0000-0000-0000-000000000001',
    user_id: 'b3000000-0000-0000-0000-000000000003',
    institution_id: INITIAL_INSTITUTION.id,
    department: 'Examination Cell',
    allowed_categories: ['Examination', 'Timetable', 'Results'],
    can_publish_without_approval: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'p2000000-0000-0000-0000-000000000002',
    user_id: 'b4000000-0000-0000-0000-000000000004',
    institution_id: INITIAL_INSTITUTION.id,
    department: 'Computer Science & Engineering',
    allowed_categories: ['Events', 'Admissions', 'General', 'Timetable'],
    can_publish_without_approval: false,
    created_at: new Date().toISOString()
  }
];

// Initial Versions & Notices
const INITIAL_VERSIONS: NoticeVersion[] = [
  // Notice 1, Version 1 (Superseded)
  {
    id: 'd1000000-0000-0000-0000-000000000001',
    notice_id: 'c1000000-0000-0000-0000-000000000001',
    version_number: 1,
    title: 'End-Semester Theory Examinations Schedule: Distributed Systems',
    description: 'Final theory examination for B.Tech CS Sem 6. All students must report with official ID cards 30 minutes before commencement.',
    exam_date: new Date(Date.now() + 14 * 86400000).toISOString(),
    effective_date: new Date(Date.now() - 5 * 86400000).toISOString(),
    expiry_date: new Date(Date.now() + 16 * 86400000).toISOString(),
    venue: 'Hall A (Main Academic Block)',
    target_audience: 'B.Tech CSE - Semester 6',
    changes_summary: 'Initial authorized publication of final examination schedule.',
    created_by: 'b3000000-0000-0000-0000-000000000003',
    reviewer_id: 'b2000000-0000-0000-0000-000000000002',
    review_status: 'superseded',
    review_feedback: 'Verified and approved by Academic Senate.',
    reviewed_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    file_hash: 'a7f43b12c8901234567890abcdef1234567890abcdef1234567890abcdef1234',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    attachments: [
      {
        id: 'att-1',
        version_id: 'd1000000-0000-0000-0000-000000000001',
        file_name: 'CS_Sem6_Exam_Schedule_v1.pdf',
        file_url: 'https://files.noticetrust.edu/notices/CS_Sem6_Exam_Schedule_v1.pdf',
        file_size: 245760,
        mime_type: 'application/pdf',
        sha256_hash: 'a7f43b12c8901234567890abcdef1234567890abcdef1234567890abcdef1234',
        extracted_text: 'NATIONAL INSTITUTE OF ENGINEERING & TECHNOLOGY\nNOTICE ID: NT-2026-EXAM-0101\nSubject: Distributed Systems Theory Examination\nDate: Nov 10, 2026. Venue: Hall A',
        is_primary: true,
        created_at: new Date(Date.now() - 5 * 86400000).toISOString()
      }
    ]
  },
  // Notice 1, Version 2 (Current Approved Active)
  {
    id: 'd1000000-0000-0000-0000-000000000002',
    notice_id: 'c1000000-0000-0000-0000-000000000001',
    version_number: 2,
    title: 'REVISED: End-Semester Theory Examinations Schedule: Distributed Systems',
    description: 'Rescheduled examination date due to regional accreditation visit. Strict entry rules apply. Calculators allowed per syllabus norms.',
    exam_date: new Date(Date.now() + 18 * 86400000).toISOString(), // 4 days later
    effective_date: new Date(Date.now() - 1 * 86400000).toISOString(),
    expiry_date: new Date(Date.now() + 20 * 86400000).toISOString(),
    venue: 'Auditorium Complex - Hall B',
    target_audience: 'B.Tech CSE - Semester 6',
    changes_summary: 'Changed exam date from original schedule; Changed venue from Hall A to Auditorium Complex Hall B due to NAAC inspection.',
    created_by: 'b3000000-0000-0000-0000-000000000003',
    reviewer_id: 'b2000000-0000-0000-0000-000000000002',
    review_status: 'approved',
    review_feedback: 'Senate review approved revision. Timetable updated on portal.',
    reviewed_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    file_hash: 'e9b87c23f109876543210fedcba09876543210fedcba09876543210fedcba0987',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    attachments: [
      {
        id: 'att-2',
        version_id: 'd1000000-0000-0000-0000-000000000002',
        file_name: 'CS_Sem6_Exam_Schedule_v2_REVISED.pdf',
        file_url: 'https://files.noticetrust.edu/notices/CS_Sem6_Exam_Schedule_v2_REVISED.pdf',
        file_size: 258048,
        mime_type: 'application/pdf',
        sha256_hash: 'e9b87c23f109876543210fedcba09876543210fedcba09876543210fedcba0987',
        extracted_text: 'NATIONAL INSTITUTE OF ENGINEERING & TECHNOLOGY\nNOTICE ID: NT-2026-EXAM-0101 (REVISION 2)\nSubject: REVISED Distributed Systems Theory Examination\nDate: Nov 15, 2026. Venue: Auditorium Complex - Hall B',
        is_primary: true,
        created_at: new Date(Date.now() - 1 * 86400000).toISOString()
      }
    ]
  },
  // Notice 2 (Conflict Notice: Lab practical overlapping in Auditorium Hall B)
  {
    id: 'd2000000-0000-0000-0000-000000000002',
    notice_id: 'c2000000-0000-0000-0000-000000000002',
    version_number: 1,
    title: 'Cloud Computing Lab Practical Viva-Voce Sessions',
    description: 'Mandatory practical lab evaluation for CSE Batch A and Batch B.',
    event_date: new Date(Date.now() + 18 * 86400000).toISOString(), // Same day as exam!
    effective_date: new Date(Date.now() - 2 * 86400000).toISOString(),
    expiry_date: new Date(Date.now() + 19 * 86400000).toISOString(),
    venue: 'Auditorium Complex - Hall B', // Same venue!
    target_audience: 'B.Tech CSE - Semester 6',
    created_by: 'b4000000-0000-0000-0000-000000000004',
    reviewer_id: 'b2000000-0000-0000-0000-000000000002',
    review_status: 'approved',
    review_feedback: 'Approved prior to examination rescheduling.',
    reviewed_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    file_hash: 'f3c14d55e66a77b88c99d00e11f22a33b44c55d66e77f88a99b00c11d22e33f4',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  // Notice 3: Active Scholarship
  {
    id: 'd3000000-0000-0000-0000-000000000003',
    notice_id: 'c3000000-0000-0000-0000-000000000003',
    version_number: 1,
    title: 'Post-Matric & National Merit Scholarship Application Window 2026-27',
    description: 'Eligible students with family income under prescribed limits can submit verified income certificates and fee receipts at the Student Welfare Cell before the deadline.',
    deadline: new Date(Date.now() + 25 * 86400000).toISOString(),
    effective_date: new Date(Date.now() - 10 * 86400000).toISOString(),
    expiry_date: new Date(Date.now() + 25 * 86400000).toISOString(),
    venue: 'Student Welfare Section (Ground Floor)',
    target_audience: 'All UG & PG Students',
    created_by: 'b2000000-0000-0000-0000-000000000002',
    reviewer_id: 'b1000000-0000-0000-0000-000000000001',
    review_status: 'approved',
    review_feedback: 'Verified with government scholarship portal guidelines.',
    reviewed_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    file_hash: 'b9c8d7e6f5a432109876543210fedcba9876543210fedcba9876543210fedcba',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  // Notice 4: Cancelled Notice
  {
    id: 'd4000000-0000-0000-0000-000000000004',
    notice_id: 'c4000000-0000-0000-0000-000000000004',
    version_number: 1,
    title: 'CANCELLED: Distinguished Guest Lecture on Quantum Computing Frontiers',
    description: 'Keynote address by visiting IEEE Fellow Dr. K. Ramanathan on scalable superconducting qubits.',
    event_date: new Date(Date.now() + 3 * 86400000).toISOString(),
    effective_date: new Date(Date.now() - 7 * 86400000).toISOString(),
    expiry_date: new Date(Date.now() + 3 * 86400000).toISOString(),
    venue: 'Seminar Hall 3',
    target_audience: 'Faculty and CS / Electronics Students',
    cancellation_reason: 'Cancelled due to speaker international flight cancellation and unavoidable health emergency. Session will be rescheduled in Spring 2027.',
    cancelled_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    created_by: 'b4000000-0000-0000-0000-000000000004',
    reviewer_id: 'b2000000-0000-0000-0000-000000000002',
    review_status: 'approved',
    review_feedback: 'Approved initial notice; subsequently processed cancellation order.',
    reviewed_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    file_hash: 'c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  // Notice 5: Expired Notice
  {
    id: 'd5000000-0000-0000-0000-000000000005',
    notice_id: 'c5000000-0000-0000-0000-000000000005',
    version_number: 1,
    title: 'First-Year Document Verification & Hostel Allocation (Phase 1)',
    description: 'Original verification window for newly admitted undergraduate engineering students.',
    deadline: new Date(Date.now() - 5 * 86400000).toISOString(),
    effective_date: new Date(Date.now() - 40 * 86400000).toISOString(),
    expiry_date: new Date(Date.now() - 5 * 86400000).toISOString(),
    venue: 'Central Gymnasium & Student Hall',
    target_audience: 'Newly Admitted B.Tech 2026 Freshers',
    created_by: 'b2000000-0000-0000-0000-000000000002',
    reviewer_id: 'b1000000-0000-0000-0000-000000000001',
    review_status: 'approved',
    reviewed_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    file_hash: 'd9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a432109876543210fedcba9876543210fe',
    created_at: new Date(Date.now() - 40 * 86400000).toISOString()
  },
  // Notice 6: Pending Approval Notice
  {
    id: 'd6000000-0000-0000-0000-000000000006',
    notice_id: 'c6000000-0000-0000-0000-000000000006',
    version_number: 1,
    title: 'Mandatory Summer Industry Internship Guidelines & NOC Submission',
    description: 'All 6th Semester students must submit company acceptance letters and obtain authorized No-Objection Certificates (NOC) before May 30.',
    deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
    effective_date: new Date().toISOString(),
    expiry_date: new Date(Date.now() + 35 * 86400000).toISOString(),
    venue: 'Department Training & Placement Office',
    target_audience: 'B.Tech CSE - Semester 6',
    created_by: 'b4000000-0000-0000-0000-000000000004',
    review_status: 'pending',
    file_hash: '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
    created_at: new Date(Date.now() - 4 * 3600000).toISOString()
  }
];

const INITIAL_NOTICES: Notice[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    notice_id: 'NT-2026-EXAM-0101',
    institution_id: INITIAL_INSTITUTION.id,
    category: 'Examination',
    department: 'Computer Science & Engineering',
    semester: 'Semester 6',
    current_version_id: 'd1000000-0000-0000-0000-000000000002',
    status: 'active',
    created_by: 'b3000000-0000-0000-0000-000000000003',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'c2000000-0000-0000-0000-000000000002',
    notice_id: 'NT-2026-LAB-0205',
    institution_id: INITIAL_INSTITUTION.id,
    category: 'Timetable',
    department: 'Computer Science & Engineering',
    semester: 'Semester 6',
    current_version_id: 'd2000000-0000-0000-0000-000000000002',
    status: 'active',
    created_by: 'b4000000-0000-0000-0000-000000000004',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'c3000000-0000-0000-0000-000000000003',
    notice_id: 'NT-2026-SCH-0330',
    institution_id: INITIAL_INSTITUTION.id,
    category: 'Scholarships',
    department: 'All Departments',
    semester: 'All',
    current_version_id: 'd3000000-0000-0000-0000-000000000003',
    status: 'active',
    created_by: 'b2000000-0000-0000-0000-000000000002',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 'c4000000-0000-0000-0000-000000000004',
    notice_id: 'NT-2026-EVT-0412',
    institution_id: INITIAL_INSTITUTION.id,
    category: 'Events',
    department: 'Computer Science & Engineering',
    semester: 'All',
    current_version_id: 'd4000000-0000-0000-0000-000000000004',
    status: 'cancelled',
    created_by: 'b4000000-0000-0000-0000-000000000004',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'c5000000-0000-0000-0000-000000000005',
    notice_id: 'NT-2026-ADM-0520',
    institution_id: INITIAL_INSTITUTION.id,
    category: 'Admissions',
    department: 'All Departments',
    semester: 'Semester 1',
    current_version_id: 'd5000000-0000-0000-0000-000000000005',
    status: 'expired',
    created_by: 'b2000000-0000-0000-0000-000000000002',
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 'c6000000-0000-0000-0000-000000000006',
    notice_id: 'NT-2026-INT-0610',
    institution_id: INITIAL_INSTITUTION.id,
    category: 'General',
    department: 'Computer Science & Engineering',
    semester: 'Semester 6',
    current_version_id: 'd6000000-0000-0000-0000-000000000006',
    status: 'pending_review',
    created_by: 'b4000000-0000-0000-0000-000000000004',
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600000).toISOString()
  }
];

const INITIAL_CONFLICTS: NoticeConflict[] = [
  {
    id: 'e1000000-0000-0000-0000-000000000001',
    notice_a_id: 'c1000000-0000-0000-0000-000000000001',
    version_a_id: 'd1000000-0000-0000-0000-000000000002',
    notice_b_id: 'c2000000-0000-0000-0000-000000000002',
    version_b_id: 'd2000000-0000-0000-0000-000000000002',
    conflict_type: 'venue_clash',
    conflicting_fields: {
      venue: 'Auditorium Complex - Hall B',
      dateA: new Date(Date.now() + 18 * 86400000).toLocaleDateString(),
      dateB: new Date(Date.now() + 18 * 86400000).toLocaleDateString(),
      targetAudience: 'B.Tech CSE - Semester 6',
      nature: 'Theory Exam vs Lab Practical Viva simultaneously occupying Hall B'
    },
    severity: 'critical',
    status: 'detected',
    detected_at: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

const INITIAL_SAVED: SavedNotice[] = [
  { id: 's1', user_id: 'b5000000-0000-0000-0000-000000000005', notice_id: 'c1000000-0000-0000-0000-000000000001', created_at: new Date().toISOString() },
  { id: 's2', user_id: 'b5000000-0000-0000-0000-000000000005', notice_id: 'c3000000-0000-0000-0000-000000000003', created_at: new Date().toISOString() }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    user_id: 'b5000000-0000-0000-0000-000000000005',
    title: 'Revision Notice: Distributed Systems Exam Rescheduled',
    message: 'Exam date updated from Nov 10 to Nov 15. Venue shifted to Auditorium Complex Hall B. Inspect Notice Trust Passport for full diff.',
    type: 'revision',
    notice_id: 'c1000000-0000-0000-0000-000000000001',
    is_read: false,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'n2',
    user_id: 'b5000000-0000-0000-0000-000000000005',
    title: 'Event Cancelled: Quantum Computing Lecture',
    message: 'Keynote lecture by Dr. K. Ramanathan cancelled due to travel emergency. See official cancellation statement.',
    type: 'cancellation',
    notice_id: 'c4000000-0000-0000-0000-000000000004',
    is_read: true,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

const INITIAL_REPORTS: NoticeReport[] = [
  {
    id: 'r1',
    notice_id: 'c1000000-0000-0000-0000-000000000001',
    version_id: 'd1000000-0000-0000-0000-000000000001',
    reporter_id: 'b5000000-0000-0000-0000-000000000005',
    report_type: 'outdated',
    description: 'A WhatsApp PDF is circulating showing Nov 10 in Hall A, but NoticeTrust shows it was revised to Nov 15 in Hall B. Requesting confirmation.',
    status: 'resolved',
    reviewer_id: 'b2000000-0000-0000-0000-000000000002',
    resolution_notes: 'Confirmed. Circular v1 was superseded by Revision v2. Sent notification broadcast to all 6th Sem students.',
    resolved_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 20 * 3600000).toISOString()
  }
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'a1',
    actor_id: 'b3000000-0000-0000-0000-000000000003',
    actor_email: 'exam.controller@noticetrust.edu',
    action_type: 'REVISION_SUBMITTED',
    target_type: 'notice',
    target_id: 'c1000000-0000-0000-0000-000000000001',
    metadata: { version: 2, changed_fields: ['exam_date', 'venue', 'description'] },
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: 'a2',
    actor_id: 'b2000000-0000-0000-0000-000000000002',
    actor_email: 'dean.academics@noticetrust.edu',
    action_type: 'REVISION_APPROVED',
    target_type: 'notice',
    target_id: 'c1000000-0000-0000-0000-000000000001',
    metadata: { version: 2, reviewer: 'Prof. Neha Verma' },
    created_at: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: 'a3',
    actor_id: 'b2000000-0000-0000-0000-000000000002',
    actor_email: 'dean.academics@noticetrust.edu',
    action_type: 'NOTICE_CANCELLED',
    target_type: 'notice',
    target_id: 'c4000000-0000-0000-0000-000000000004',
    metadata: { reason: 'Speaker travel emergency' },
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

interface DBStore {
  institution: Institution;
  profiles: Profile[];
  publisherPermissions: PublisherPermission[];
  notices: Notice[];
  versions: NoticeVersion[];
  conflicts: NoticeConflict[];
  savedNotices: SavedNotice[];
  notifications: Notification[];
  reports: NoticeReport[];
  auditLogs: AuditLog[];
}

function loadStore(): DBStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to parse DB store from localStorage:', e);
  }

  const initial: DBStore = {
    institution: INITIAL_INSTITUTION,
    profiles: INITIAL_PROFILES,
    publisherPermissions: INITIAL_PERMISSIONS,
    notices: INITIAL_NOTICES,
    versions: INITIAL_VERSIONS,
    conflicts: INITIAL_CONFLICTS,
    savedNotices: INITIAL_SAVED,
    notifications: INITIAL_NOTIFICATIONS,
    reports: INITIAL_REPORTS,
    auditLogs: INITIAL_AUDIT_LOGS
  };

  saveStore(initial);
  return initial;
}

function saveStore(store: DBStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.warn('Failed to save DB store to localStorage:', e);
  }
}

// Populate relationship helpers
function hydrateNotice(notice: Notice, store: DBStore, currentUserId?: string): Notice {
  const versions = store.versions.filter(v => v.notice_id === notice.id);
  const curVer = versions.find(v => v.id === notice.current_version_id);
  const creator = store.profiles.find(p => p.id === notice.created_by);
  const is_saved = currentUserId 
    ? store.savedNotices.some(s => s.user_id === currentUserId && s.notice_id === notice.id) 
    : false;

  return {
    ...notice,
    institution: store.institution,
    current_version: curVer ? {
      ...curVer,
      creator: store.profiles.find(p => p.id === curVer.created_by),
      reviewer: store.profiles.find(p => p.id === curVer.reviewer_id)
    } : undefined,
    versions: versions.sort((a, b) => b.version_number - a.version_number),
    creator,
    is_saved
  };
}

/**
 * NoticeTrust Unified Data Provider
 */
export const db = {
  resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    return loadStore();
  },

  getStore() {
    return loadStore();
  },

  // 1. INSTITUTIONS
  getInstitution(): Institution {
    const store = loadStore();
    return store.institution;
  },

  // 2. PROFILES
  getProfiles(): Profile[] {
    const store = loadStore();
    return store.profiles;
  },

  getProfileById(id: string): Profile | undefined {
    const store = loadStore();
    return store.profiles.find(p => p.id === id);
  },

  // 3. NOTICES (Search & Filter)
  getNotices(params: NoticeFilterParams = {}, currentUserId?: string): { notices: Notice[]; total: number } {
    const store = loadStore();
    let list = store.notices.map(n => hydrateNotice(n, store, currentUserId));

    // Status auto-expiry evaluation: if expiry date has passed, mark notice as expired
    const now = new Date().getTime();
    list = list.map(n => {
      if (n.status === 'active' && n.current_version?.expiry_date) {
        const expTime = new Date(n.current_version.expiry_date).getTime();
        if (expTime < now) {
          n.status = 'expired';
        }
      }
      return n;
    });

    // Filtering
    if (params.searchQuery) {
      const q = params.searchQuery.toLowerCase();
      list = list.filter(n => 
        n.notice_id.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        n.department.toLowerCase().includes(q) ||
        n.current_version?.title.toLowerCase().includes(q) ||
        n.current_version?.description?.toLowerCase().includes(q) ||
        n.current_version?.venue?.toLowerCase().includes(q)
      );
    }

    if (params.category && params.category !== 'All') {
      list = list.filter(n => n.category.toLowerCase() === params.category!.toLowerCase());
    }

    if (params.department && params.department !== 'All') {
      list = list.filter(n => n.department === params.department || n.department === 'All Departments');
    }

    if (params.semester && params.semester !== 'All') {
      list = list.filter(n => n.semester === params.semester || n.semester === 'All');
    }

    if (params.status && params.status !== 'All') {
      list = list.filter(n => n.status === params.status);
    }

    const total = list.length;
    // Sorting: newest updated first
    list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return { notices: list, total };
  },

  getNoticeById(id: string, currentUserId?: string): Notice | undefined {
    const store = loadStore();
    const notice = store.notices.find(n => n.id === id);
    if (!notice) return undefined;
    return hydrateNotice(notice, store, currentUserId);
  },

  getNoticeByNoticeId(noticeId: string, currentUserId?: string): Notice | undefined {
    const store = loadStore();
    const notice = store.notices.find(n => n.notice_id.toUpperCase() === noticeId.toUpperCase());
    if (!notice) return undefined;
    return hydrateNotice(notice, store, currentUserId);
  },

  // 4. PUBLISHER DRAFT CREATION
  createNoticeDraft(data: {
    title: string;
    description: string;
    category: string;
    department: string;
    semester?: string;
    effective_date: string;
    expiry_date?: string;
    exam_date?: string;
    event_date?: string;
    venue?: string;
    target_audience?: string;
    publisher_id: string;
    attachments?: Array<{ name: string; url: string; size: number; hash: string }>;
  }): Notice {
    const store = loadStore();
    const noticeIdStr = `NT-${new Date().getFullYear()}-${data.category.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newNoticeId = 'c' + crypto.randomUUID().slice(1);
    const newVersionId = 'd' + crypto.randomUUID().slice(1);

    const newVersion: NoticeVersion = {
      id: newVersionId,
      notice_id: newNoticeId,
      version_number: 1,
      title: data.title,
      description: data.description,
      effective_date: data.effective_date,
      expiry_date: data.expiry_date,
      exam_date: data.exam_date,
      event_date: data.event_date,
      venue: data.venue,
      target_audience: data.target_audience || `${data.department} - ${data.semester || 'All'}`,
      changes_summary: 'Initial draft version submitted by publisher.',
      created_by: data.publisher_id,
      review_status: 'pending',
      file_hash: data.attachments?.[0]?.hash || crypto.randomUUID().replace(/-/g, ''),
      created_at: new Date().toISOString(),
      attachments: data.attachments?.map((att, idx) => ({
        id: `att-${Date.now()}-${idx}`,
        version_id: newVersionId,
        file_name: att.name,
        file_url: att.url,
        file_size: att.size,
        mime_type: 'application/pdf',
        sha256_hash: att.hash,
        is_primary: idx === 0,
        created_at: new Date().toISOString()
      }))
    };

    const newNotice: Notice = {
      id: newNoticeId,
      notice_id: noticeIdStr,
      institution_id: store.institution.id,
      category: data.category,
      department: data.department,
      semester: data.semester || 'All',
      current_version_id: newVersionId,
      status: 'pending_review',
      created_by: data.publisher_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    store.versions.push(newVersion);
    store.notices.push(newNotice);

    // Audit log
    const publisher = store.profiles.find(p => p.id === data.publisher_id);
    store.auditLogs.unshift({
      id: crypto.randomUUID(),
      actor_id: data.publisher_id,
      actor_email: publisher?.email,
      action_type: 'NOTICE_DRAFT_SUBMITTED',
      target_type: 'notice',
      target_id: newNoticeId,
      metadata: { notice_id: noticeIdStr, version: 1 },
      created_at: new Date().toISOString()
    });

    saveStore(store);
    return hydrateNotice(newNotice, store, data.publisher_id);
  },

  // 5. SUBMIT REVISION
  submitRevision(noticeId: string, revisionData: {
    title: string;
    description: string;
    effective_date: string;
    expiry_date?: string;
    exam_date?: string;
    event_date?: string;
    deadline?: string;
    venue?: string;
    target_audience?: string;
    changes_summary?: string;
    publisher_id: string;
    attachments?: Array<{ name: string; url: string; size: number; hash: string }>;
  }): NoticeVersion {
    const store = loadStore();
    const notice = store.notices.find(n => n.id === noticeId);
    if (!notice) throw new Error('Notice not found');

    const existingVersions = store.versions.filter(v => v.notice_id === noticeId);
    const maxVersionNumber = Math.max(...existingVersions.map(v => v.version_number), 1);
    const newVersionNumber = maxVersionNumber + 1;
    const newVersionId = 'd' + crypto.randomUUID().slice(1);

    const oldVersion = existingVersions.find(v => v.id === notice.current_version_id) || existingVersions[0];

    const tempNewVersion: NoticeVersion = {
      id: newVersionId,
      notice_id: noticeId,
      version_number: newVersionNumber,
      title: revisionData.title,
      description: revisionData.description,
      effective_date: revisionData.effective_date,
      expiry_date: revisionData.expiry_date,
      exam_date: revisionData.exam_date,
      event_date: revisionData.event_date,
      deadline: revisionData.deadline,
      venue: revisionData.venue,
      target_audience: revisionData.target_audience,
      created_by: revisionData.publisher_id,
      review_status: 'pending',
      created_at: new Date().toISOString()
    };

    // Auto-generate diff summary using Revision Impact Detector
    const diff = compareNoticeVersions(oldVersion, tempNewVersion);
    const autoSummary = revisionData.changes_summary || diff.summaryItems.join('; ');

    const newVersion: NoticeVersion = {
      ...tempNewVersion,
      changes_summary: autoSummary,
      file_hash: revisionData.attachments?.[0]?.hash || crypto.randomUUID().replace(/-/g, ''),
      attachments: revisionData.attachments?.map((att, idx) => ({
        id: `att-${Date.now()}-${idx}`,
        version_id: newVersionId,
        file_name: att.name,
        file_url: att.url,
        file_size: att.size,
        mime_type: 'application/pdf',
        sha256_hash: att.hash,
        is_primary: idx === 0,
        created_at: new Date().toISOString()
      }))
    };

    store.versions.push(newVersion);
    notice.updated_at = new Date().toISOString();

    const publisher = store.profiles.find(p => p.id === revisionData.publisher_id);
    store.auditLogs.unshift({
      id: crypto.randomUUID(),
      actor_id: revisionData.publisher_id,
      actor_email: publisher?.email,
      action_type: 'REVISION_SUBMITTED',
      target_type: 'notice',
      target_id: noticeId,
      metadata: { 
        version: newVersionNumber, 
        critical_changes: diff.criticalChangesCount,
        summary: autoSummary 
      },
      created_at: new Date().toISOString()
    });

    saveStore(store);
    return newVersion;
  },

  // 6. APPROVE VERSION (Admin)
  approveNoticeVersion(noticeId: string, versionId: string, reviewerId: string, feedback?: string) {
    const store = loadStore();
    const notice = store.notices.find(n => n.id === noticeId);
    const version = store.versions.find(v => v.id === versionId);
    if (!notice || !version) throw new Error('Notice or version not found');

    // Separation of duties rule: publisher cannot approve their own submission
    if (version.created_by === reviewerId) {
      throw new Error('Separation of duties violation: An authorized publisher cannot approve their own notice.');
    }

    // Supersede previously approved versions
    store.versions.forEach(v => {
      if (v.notice_id === noticeId && v.id !== versionId && v.review_status === 'approved') {
        v.review_status = 'superseded';
      }
    });

    version.review_status = 'approved';
    version.reviewer_id = reviewerId;
    version.reviewed_at = new Date().toISOString();
    version.review_feedback = feedback || 'Officially verified and approved by institution authority.';

    notice.current_version_id = versionId;
    notice.status = 'active';
    notice.updated_at = new Date().toISOString();

    // Create moderation action
    const reviewer = store.profiles.find(p => p.id === reviewerId);
    store.auditLogs.unshift({
      id: crypto.randomUUID(),
      actor_id: reviewerId,
      actor_email: reviewer?.email,
      action_type: 'NOTICE_VERSION_APPROVED',
      target_type: 'notice',
      target_id: noticeId,
      metadata: { version: version.version_number, reviewer_name: reviewer?.full_name },
      created_at: new Date().toISOString()
    });

    // Notify subscribed students if this is a revision
    if (version.version_number > 1) {
      store.notifications.unshift({
        id: crypto.randomUUID(),
        user_id: 'b5000000-0000-0000-0000-000000000005', // Priya Sharma
        title: `Revision Approved: ${version.title.slice(0, 45)}...`,
        message: version.changes_summary || 'Notice details have been officially updated. Inspect Trust Passport for changes.',
        type: 'revision',
        notice_id: noticeId,
        is_read: false,
        created_at: new Date().toISOString()
      });
    }

    saveStore(store);
    return hydrateNotice(notice, store);
  },

  // 7. REJECT VERSION (Admin)
  rejectNoticeVersion(noticeId: string, versionId: string, reviewerId: string, reason: string) {
    const store = loadStore();
    const version = store.versions.find(v => v.id === versionId);
    const notice = store.notices.find(n => n.id === noticeId);
    if (!version || !notice) throw new Error('Notice or version not found');

    version.review_status = 'rejected';
    version.reviewer_id = reviewerId;
    version.reviewed_at = new Date().toISOString();
    version.review_feedback = reason;

    if (notice.current_version_id === versionId && version.version_number === 1) {
      notice.status = 'draft';
    }

    const reviewer = store.profiles.find(p => p.id === reviewerId);
    store.auditLogs.unshift({
      id: crypto.randomUUID(),
      actor_id: reviewerId,
      actor_email: reviewer?.email,
      action_type: 'NOTICE_VERSION_REJECTED',
      target_type: 'notice',
      target_id: noticeId,
      metadata: { version: version.version_number, reason },
      created_at: new Date().toISOString()
    });

    saveStore(store);
  },

  // 8. CANCEL NOTICE (Admin)
  cancelNotice(noticeId: string, reviewerId: string, reason: string) {
    const store = loadStore();
    const notice = store.notices.find(n => n.id === noticeId);
    if (!notice) throw new Error('Notice not found');

    const curVer = store.versions.find(v => v.id === notice.current_version_id);
    if (curVer) {
      curVer.cancellation_reason = reason;
      curVer.cancelled_at = new Date().toISOString();
    }

    notice.status = 'cancelled';
    notice.updated_at = new Date().toISOString();

    const reviewer = store.profiles.find(p => p.id === reviewerId);
    store.auditLogs.unshift({
      id: crypto.randomUUID(),
      actor_id: reviewerId,
      actor_email: reviewer?.email,
      action_type: 'NOTICE_CANCELLED',
      target_type: 'notice',
      target_id: noticeId,
      metadata: { reason, reviewer: reviewer?.full_name },
      created_at: new Date().toISOString()
    });

    // Notify subscribed students
    store.notifications.unshift({
      id: crypto.randomUUID(),
      user_id: 'b5000000-0000-0000-0000-000000000005',
      title: `Notice Cancelled: ${curVer?.title.slice(0, 40)}...`,
      message: `Reason: ${reason}`,
      type: 'cancellation',
      notice_id: noticeId,
      is_read: false,
      created_at: new Date().toISOString()
    });

    saveStore(store);
    return hydrateNotice(notice, store);
  },

  // 9. CONFLICT RESOLUTION (Admin)
  getConflicts(): NoticeConflict[] {
    const store = loadStore();
    return store.conflicts.map(c => ({
      ...c,
      notice_a: store.notices.find(n => n.id === c.notice_a_id),
      version_a: store.versions.find(v => v.id === c.version_a_id),
      notice_b: store.notices.find(n => n.id === c.notice_b_id),
      version_b: store.versions.find(v => v.id === c.version_b_id),
      resolver: c.resolved_by ? store.profiles.find(p => p.id === c.resolved_by) : undefined
    }));
  },

  resolveConflict(conflictId: string, reviewerId: string, decision: 'resolved' | 'false_positive' | 'confirmed', notes: string) {
    const store = loadStore();
    const conflict = store.conflicts.find(c => c.id === conflictId);
    if (!conflict) throw new Error('Conflict record not found');

    conflict.status = decision;
    conflict.resolved_by = reviewerId;
    conflict.resolution_notes = notes;
    conflict.resolved_at = new Date().toISOString();

    const reviewer = store.profiles.find(p => p.id === reviewerId);
    store.auditLogs.unshift({
      id: crypto.randomUUID(),
      actor_id: reviewerId,
      actor_email: reviewer?.email,
      action_type: 'CONFLICT_RESOLVED',
      target_type: 'conflict',
      target_id: conflictId,
      metadata: { decision, notes, reviewer: reviewer?.full_name },
      created_at: new Date().toISOString()
    });

    saveStore(store);
  },

  // 10. STUDENT BOOKMARKS
  toggleSaveNotice(userId: string, noticeId: string): boolean {
    const store = loadStore();
    const idx = store.savedNotices.findIndex(s => s.user_id === userId && s.notice_id === noticeId);
    let isSaved = false;
    if (idx >= 0) {
      store.savedNotices.splice(idx, 1);
      isSaved = false;
    } else {
      store.savedNotices.push({
        id: crypto.randomUUID(),
        user_id: userId,
        notice_id: noticeId,
        created_at: new Date().toISOString()
      });
      isSaved = true;
    }
    saveStore(store);
    return isSaved;
  },

  getSavedNotices(userId: string): Notice[] {
    const store = loadStore();
    const savedIds = store.savedNotices.filter(s => s.user_id === userId).map(s => s.notice_id);
    return store.notices
      .filter(n => savedIds.includes(n.id))
      .map(n => hydrateNotice(n, store, userId));
  },

  // 11. STUDENT REPORTS
  submitNoticeReport(data: {
    notice_id: string;
    version_id?: string;
    reporter_id: string;
    report_type: any;
    description: string;
  }): NoticeReport {
    const store = loadStore();
    const newReport: NoticeReport = {
      id: crypto.randomUUID(),
      notice_id: data.notice_id,
      version_id: data.version_id,
      reporter_id: data.reporter_id,
      report_type: data.report_type,
      description: data.description,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    store.reports.unshift(newReport);
    saveStore(store);
    return newReport;
  },

  getReports(): NoticeReport[] {
    const store = loadStore();
    return store.reports.map(r => ({
      ...r,
      notice: hydrateNotice(store.notices.find(n => n.id === r.notice_id)!, store),
      reporter: store.profiles.find(p => p.id === r.reporter_id),
      reviewer: r.reviewer_id ? store.profiles.find(p => p.id === r.reviewer_id) : undefined
    }));
  },

  resolveReport(reportId: string, reviewerId: string, notes: string, status: 'resolved' | 'dismissed') {
    const store = loadStore();
    const report = store.reports.find(r => r.id === reportId);
    if (!report) throw new Error('Report not found');

    report.status = status;
    report.reviewer_id = reviewerId;
    report.resolution_notes = notes;
    report.resolved_at = new Date().toISOString();

    const reviewer = store.profiles.find(p => p.id === reviewerId);
    store.auditLogs.unshift({
      id: crypto.randomUUID(),
      actor_id: reviewerId,
      actor_email: reviewer?.email,
      action_type: 'REPORT_RESOLVED',
      target_type: 'report',
      target_id: reportId,
      metadata: { status, notes },
      created_at: new Date().toISOString()
    });

    saveStore(store);
  },

  // 12. NOTIFICATIONS
  getUserNotifications(userId: string): Notification[] {
    const store = loadStore();
    return store.notifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  markNotificationRead(notificationId: string) {
    const store = loadStore();
    const notif = store.notifications.find(n => n.id === notificationId);
    if (notif) {
      notif.is_read = true;
      saveStore(store);
    }
  },

  // 13. AUDIT LOGS
  getAuditLogs(): AuditLog[] {
    const store = loadStore();
    return store.auditLogs.map(l => ({
      ...l,
      actor: l.actor_id ? store.profiles.find(p => p.id === l.actor_id) : undefined
    }));
  },

  // 14. DASHBOARD METRICS (Real calculations from DB)
  getDashboardMetrics() {
    const store = loadStore();
    const notices = store.notices;

    const totalPublished = notices.filter(n => ['active', 'approved', 'upcoming', 'expired', 'cancelled'].includes(n.status)).length;
    const active = notices.filter(n => n.status === 'active').length;
    const upcoming = notices.filter(n => n.status === 'upcoming').length;
    const expired = notices.filter(n => n.status === 'expired').length;
    const cancelled = notices.filter(n => n.status === 'cancelled').length;
    const pendingApprovals = store.versions.filter(v => v.review_status === 'pending').length;
    const pendingReports = store.reports.filter(r => r.status === 'pending').length;
    const openConflicts = store.conflicts.filter(c => c.status === 'detected' || c.status === 'confirmed').length;
    const totalRevisions = store.versions.filter(v => v.version_number > 1).length;

    return {
      totalPublished,
      active,
      upcoming,
      expired,
      cancelled,
      pendingApprovals,
      pendingReports,
      openConflicts,
      totalRevisions
    };
  }
};
