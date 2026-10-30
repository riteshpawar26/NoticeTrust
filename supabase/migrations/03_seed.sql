-- NoticeTrust Demo Seed Data
-- Demonstrates all 4 roles, notice revision timeline, conflict radar, and lifecycle states

-- 1. Insert Institution
INSERT INTO institutions (id, name, code, domain, address, timezone, contact_email, is_verified)
VALUES (
    'a1000000-0000-0000-0000-000000000001',
    'National Institute of Engineering & Technology',
    'NIET-TECH',
    'niet.edu.in',
    'Innovation Tech Park, Sector 4, Pune, MH, India',
    'Asia/Kolkata',
    'registrar@niet.edu.in',
    true
) ON CONFLICT (code) DO NOTHING;

-- 2. Insert Profiles
-- Super Admin
INSERT INTO profiles (id, email, full_name, role, institution_id, department, phone)
VALUES (
    'b1000000-0000-0000-0000-000000000001',
    'superadmin@noticetrust.edu',
    'Dr. S. Radhakrishnan',
    'super_admin',
    'a1000000-0000-0000-0000-000000000001',
    'Directorate',
    '+91 98220 11001'
) ON CONFLICT (id) DO NOTHING;

-- Admin / Reviewer
INSERT INTO profiles (id, email, full_name, role, institution_id, department, phone)
VALUES (
    'b2000000-0000-0000-0000-000000000002',
    'dean.academics@noticetrust.edu',
    'Prof. Neha Verma (Dean Academics)',
    'admin',
    'a1000000-0000-0000-0000-000000000001',
    'Academic Affairs',
    '+91 98220 22002'
) ON CONFLICT (id) DO NOTHING;

-- Authorized Publisher 1 (Controller of Examinations)
INSERT INTO profiles (id, email, full_name, role, institution_id, department, phone)
VALUES (
    'b3000000-0000-0000-0000-000000000003',
    'exam.controller@noticetrust.edu',
    'Dr. Aris Thorne (Controller of Exams)',
    'publisher',
    'a1000000-0000-0000-0000-000000000001',
    'Examination Cell',
    '+91 98220 33003'
) ON CONFLICT (id) DO NOTHING;

-- Authorized Publisher 2 (HOD Computer Science)
INSERT INTO profiles (id, email, full_name, role, institution_id, department, phone)
VALUES (
    'b4000000-0000-0000-0000-000000000004',
    'hod.cs@noticetrust.edu',
    'Dr. Ramesh Gupta (HOD Computer Science)',
    'publisher',
    'a1000000-0000-0000-0000-000000000001',
    'Computer Science & Engineering',
    '+91 98220 44004'
) ON CONFLICT (id) DO NOTHING;

-- Student 1
INSERT INTO profiles (id, email, full_name, role, institution_id, department, semester, student_id, phone)
VALUES (
    'b5000000-0000-0000-0000-000000000005',
    'priya.sharma@noticetrust.edu',
    'Priya Sharma',
    'student',
    'a1000000-0000-0000-0000-000000000001',
    'Computer Science & Engineering',
    'Semester 6',
    'CS2023-8842',
    '+91 98220 55005'
) ON CONFLICT (id) DO NOTHING;

-- 3. Publisher Permissions
INSERT INTO publisher_permissions (user_id, institution_id, department, allowed_categories, can_publish_without_approval, granted_by)
VALUES 
(
    'b3000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000001',
    'Examination Cell',
    ARRAY['Examination', 'Timetable', 'Results'],
    false,
    'b2000000-0000-0000-0000-000000000002'
),
(
    'b4000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000001',
    'Computer Science & Engineering',
    ARRAY['Events', 'Admissions', 'General', 'Timetable'],
    false,
    'b2000000-0000-0000-0000-000000000002'
);

-- 4. NOTICE 1: Revised End-Semester Examination Schedule (Has V1 superseded and V2 active)
INSERT INTO notices (id, notice_id, institution_id, category, department, semester, status, created_by, created_at)
VALUES (
    'c1000000-0000-0000-0000-000000000001',
    'NT-2026-EXAM-0101',
    'a1000000-0000-0000-0000-000000000001',
    'Examination',
    'Computer Science & Engineering',
    'Semester 6',
    'active',
    'b3000000-0000-0000-0000-000000000003',
    NOW() - INTERVAL '5 days'
);

-- Version 1 (Superseded)
INSERT INTO notice_versions (
    id, notice_id, version_number, title, description,
    exam_date, effective_date, expiry_date, venue, target_audience,
    changes_summary, created_by, reviewer_id, review_status, review_feedback, reviewed_at,
    file_hash, created_at
) VALUES (
    'd1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    1,
    'End-Semester Theory Examinations Schedule: Distributed Systems',
    'Final theory examination for B.Tech CS Sem 6. All students must report with official ID cards 30 minutes before commencement.',
    NOW() + INTERVAL '14 days',
    NOW() - INTERVAL '5 days',
    NOW() + INTERVAL '16 days',
    'Hall A (Main Academic Block)',
    'B.Tech CSE - Semester 6',
    'Initial authorized publication of final examination schedule.',
    'b3000000-0000-0000-0000-000000000003',
    'b2000000-0000-0000-0000-000000000002',
    'superseded',
    'Verified and approved by Academic Senate.',
    NOW() - INTERVAL '5 days',
    'a7f43b12c8901234567890abcdef1234567890abcdef1234567890abcdef1234',
    NOW() - INTERVAL '5 days'
);

-- Version 2 (Current Approved & Active)
INSERT INTO notice_versions (
    id, notice_id, version_number, title, description,
    exam_date, effective_date, expiry_date, venue, target_audience,
    changes_summary, created_by, reviewer_id, review_status, review_feedback, reviewed_at,
    file_hash, created_at
) VALUES (
    'd1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    2,
    'REVISED: End-Semester Theory Examinations Schedule: Distributed Systems',
    'Rescheduled examination date due to regional accreditation visit. Strict entry rules apply. Calculators allowed per syllabus norms.',
    NOW() + INTERVAL '18 days', -- Date moved forward by 4 days
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '20 days',
    'Auditorium Complex - Hall B', -- Venue changed
    'B.Tech CSE - Semester 6',
    'Changed exam date from Nov 10 to Nov 15; Changed venue from Hall A to Auditorium Complex Hall B due to accreditation inspections.',
    'b3000000-0000-0000-0000-000000000003',
    'b2000000-0000-0000-0000-000000000002',
    'approved',
    'Senate review approved revision. Timetable updated on portal.',
    NOW() - INTERVAL '1 day',
    'e9b87c23f109876543210fedcba09876543210fedcba09876543210fedcba0987',
    NOW() - INTERVAL '1 day'
);

-- Update notice current_version_id
UPDATE notices SET current_version_id = 'd1000000-0000-0000-0000-000000000002' 
WHERE id = 'c1000000-0000-0000-0000-000000000001';

-- Attachments for Notice 1
INSERT INTO notice_attachments (version_id, file_name, file_url, file_size, mime_type, sha256_hash, extracted_text, is_primary)
VALUES 
(
    'd1000000-0000-0000-0000-000000000001',
    'CS_Sem6_Exam_Schedule_v1.pdf',
    'https://files.noticetrust.edu/notices/CS_Sem6_Exam_Schedule_v1.pdf',
    245760,
    'application/pdf',
    'a7f43b12c8901234567890abcdef1234567890abcdef1234567890abcdef1234',
    'NATIONAL INSTITUTE OF ENGINEERING & TECHNOLOGY
OFFICE OF CONTROLLER OF EXAMINATIONS
NOTICE ID: NT-2026-EXAM-0101
Subject: Distributed Systems Theory Examination
Date: November 10, 2026. Time: 10:00 AM - 01:00 PM
Venue: Hall A (Main Academic Block)
Audience: B.Tech Computer Science Semester 6
Controller of Examinations: Dr. Aris Thorne',
    true
),
(
    'd1000000-0000-0000-0000-000000000002',
    'CS_Sem6_Exam_Schedule_v2_REVISED.pdf',
    'https://files.noticetrust.edu/notices/CS_Sem6_Exam_Schedule_v2_REVISED.pdf',
    258048,
    'application/pdf',
    'e9b87c23f109876543210fedcba09876543210fedcba09876543210fedcba0987',
    'NATIONAL INSTITUTE OF ENGINEERING & TECHNOLOGY
OFFICE OF CONTROLLER OF EXAMINATIONS
NOTICE ID: NT-2026-EXAM-0101 (REVISION 2)
Subject: REVISED Distributed Systems Theory Examination
Date: November 15, 2026. Time: 10:00 AM - 01:00 PM
Venue: Auditorium Complex - Hall B
Audience: B.Tech Computer Science Semester 6
Reason for revision: NAAC peer team accreditation schedule conflict.
Controller of Examinations: Dr. Aris Thorne',
    true
);

-- 5. NOTICE 2: Potential Conflicting Notice (Radar Feature)
-- Another notice scheduling a Lab Practical in the same Hall B on the same date!
INSERT INTO notices (id, notice_id, institution_id, category, department, semester, status, created_by, created_at)
VALUES (
    'c2000000-0000-0000-0000-000000000002',
    'NT-2026-LAB-0205',
    'a1000000-0000-0000-0000-000000000001',
    'Timetable',
    'Computer Science & Engineering',
    'Semester 6',
    'active',
    'b4000000-0000-0000-0000-000000000004',
    NOW() - INTERVAL '2 days'
);

INSERT INTO notice_versions (
    id, notice_id, version_number, title, description,
    event_date, effective_date, expiry_date, venue, target_audience,
    created_by, reviewer_id, review_status, review_feedback, reviewed_at,
    file_hash, created_at
) VALUES (
    'd2000000-0000-0000-0000-000000000002',
    'c2000000-0000-0000-0000-000000000002',
    1,
    'Cloud Computing Lab Practical Viva-Voce Sessions',
    'Mandatory practical lab evaluation for CSE Batch A and Batch B.',
    NOW() + INTERVAL '18 days', -- Overlapping date with Exam!
    NOW() - INTERVAL '2 days',
    NOW() + INTERVAL '19 days',
    'Auditorium Complex - Hall B', -- Venue clash!
    'B.Tech CSE - Semester 6',
    'b4000000-0000-0000-0000-000000000004',
    'b2000000-0000-0000-0000-000000000002',
    'approved',
    'Approved prior to examination rescheduling.',
    NOW() - INTERVAL '2 days',
    'f3c14d55e66a77b88c99d00e11f22a33b44c55d66e77f88a99b00c11d22e33f4',
    NOW() - INTERVAL '2 days'
);

UPDATE notices SET current_version_id = 'd2000000-0000-0000-0000-000000000002' 
WHERE id = 'c2000000-0000-0000-0000-000000000002';

-- 6. RECORD CONFLICT IN Cross-Notice Conflict Radar
INSERT INTO notice_conflicts (
    id, notice_a_id, version_a_id, notice_b_id, version_b_id,
    conflict_type, conflicting_fields, severity, status, detected_at
) VALUES (
    'e1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'd1000000-0000-0000-0000-000000000002',
    'c2000000-0000-0000-0000-000000000002',
    'd2000000-0000-0000-0000-000000000002',
    'venue_clash',
    '{"conflicting_venue": "Auditorium Complex - Hall B", "date_a": "Nov 15, 2026 10:00 AM", "date_b": "Nov 15, 2026 10:00 AM", "target_audience": "B.Tech CSE - Semester 6", "nature": "Theory Exam vs Lab Practical Viva simultaneously occupying Hall B"}'::jsonb,
    'critical',
    'detected',
    NOW() - INTERVAL '1 day'
);

-- 7. NOTICE 3: Active Scholarship Notice
INSERT INTO notices (id, notice_id, institution_id, category, department, semester, status, created_by, created_at)
VALUES (
    'c3000000-0000-0000-0000-000000000003',
    'NT-2026-SCH-0330',
    'a1000000-0000-0000-0000-000000000001',
    'Scholarships',
    'All Departments',
    'All',
    'active',
    'b2000000-0000-0000-0000-000000000002',
    NOW() - INTERVAL '10 days'
);

INSERT INTO notice_versions (
    id, notice_id, version_number, title, description,
    deadline, effective_date, expiry_date, venue, target_audience,
    created_by, reviewer_id, review_status, review_feedback, reviewed_at,
    file_hash, created_at
) VALUES (
    'd3000000-0000-0000-0000-000000000003',
    'c3000000-0000-0000-0000-000000000003',
    1,
    'Post-Matric & National Merit Scholarship Application Window 2026-27',
    'Eligible students with family income under prescribed limits can submit verified income certificates and fee receipts at the Student Welfare Cell before the deadline.',
    NOW() + INTERVAL '25 days',
    NOW() - INTERVAL '10 days',
    NOW() + INTERVAL '25 days',
    'Student Welfare Section (Ground Floor)',
    'All UG & PG Students',
    'b2000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'approved',
    'Verified with government scholarship portal guidelines.',
    NOW() - INTERVAL '10 days',
    'b9c8d7e6f5a432109876543210fedcba9876543210fedcba9876543210fedcba',
    NOW() - INTERVAL '10 days'
);

UPDATE notices SET current_version_id = 'd3000000-0000-0000-0000-000000000003' 
WHERE id = 'c3000000-0000-0000-0000-000000000003';

-- 8. NOTICE 4: Cancelled Notice with recorded reason
INSERT INTO notices (id, notice_id, institution_id, category, department, semester, status, created_by, created_at)
VALUES (
    'c4000000-0000-0000-0000-000000000004',
    'NT-2026-EVT-0412',
    'a1000000-0000-0000-0000-000000000001',
    'Events',
    'Computer Science & Engineering',
    'All',
    'cancelled',
    'b4000000-0000-0000-0000-000000000004',
    NOW() - INTERVAL '7 days'
);

INSERT INTO notice_versions (
    id, notice_id, version_number, title, description,
    event_date, effective_date, expiry_date, venue, target_audience,
    cancellation_reason, cancelled_at, created_by, reviewer_id, review_status, review_feedback, reviewed_at,
    file_hash, created_at
) VALUES (
    'd4000000-0000-0000-0000-000000000004',
    'c4000000-0000-0000-0000-000000000004',
    1,
    'CANCELLED: Distinguished Guest Lecture on Quantum Computing Frontiers',
    'Keynote address by visiting IEEE Fellow Dr. K. Ramanathan on scalable superconducting qubits.',
    NOW() + INTERVAL '3 days',
    NOW() - INTERVAL '7 days',
    NOW() + INTERVAL '3 days',
    'Seminar Hall 3',
    'Faculty and CS / Electronics Students',
    'Cancelled due to speaker international flight cancellation and unavoidable health emergency. Session will be rescheduled in Spring 2027.',
    NOW() - INTERVAL '2 days',
    'b4000000-0000-0000-0000-000000000004',
    'b2000000-0000-0000-0000-000000000002',
    'approved',
    'Approved initial notice; subsequently processed cancellation order.',
    NOW() - INTERVAL '7 days',
    'c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7',
    NOW() - INTERVAL '7 days'
);

UPDATE notices SET current_version_id = 'd4000000-0000-0000-0000-000000000004' 
WHERE id = 'c4000000-0000-0000-0000-000000000004';

-- 9. NOTICE 5: Expired Notice
INSERT INTO notices (id, notice_id, institution_id, category, department, semester, status, created_by, created_at)
VALUES (
    'c5000000-0000-0000-0000-000000000005',
    'NT-2026-ADM-0520',
    'a1000000-0000-0000-0000-000000000001',
    'Admissions',
    'All Departments',
    'Semester 1',
    'expired',
    'b2000000-0000-0000-0000-000000000002',
    NOW() - INTERVAL '40 days'
);

INSERT INTO notice_versions (
    id, notice_id, version_number, title, description,
    deadline, effective_date, expiry_date, venue, target_audience,
    created_by, reviewer_id, review_status, review_feedback, reviewed_at,
    file_hash, created_at
) VALUES (
    'd5000000-0000-0000-0000-000000000005',
    'c5000000-0000-0000-0000-000000000005',
    1,
    'First-Year Document Verification & Hostel Allocation (Phase 1)',
    'Original verification window for newly admitted undergraduate engineering students.',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '40 days',
    NOW() - INTERVAL '5 days',
    'Central Gymnasium & Student Hall',
    'Newly Admitted B.Tech 2026 Freshers',
    'b2000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'approved',
    'Verified by Admission Committee.',
    NOW() - INTERVAL '40 days',
    'd9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a432109876543210fedcba9876543210fe',
    NOW() - INTERVAL '40 days'
);

UPDATE notices SET current_version_id = 'd5000000-0000-0000-0000-000000000005' 
WHERE id = 'c5000000-0000-0000-0000-000000000005';

-- 10. NOTICE 6: Pending Approval Notice
INSERT INTO notices (id, notice_id, institution_id, category, department, semester, status, created_by, created_at)
VALUES (
    'c6000000-0000-0000-0000-000000000006',
    'NT-2026-INT-0610',
    'a1000000-0000-0000-0000-000000000001',
    'General',
    'Computer Science & Engineering',
    'Semester 6',
    'pending_review',
    'b4000000-0000-0000-0000-000000000004',
    NOW() - INTERVAL '4 hours'
);

INSERT INTO notice_versions (
    id, notice_id, version_number, title, description,
    deadline, effective_date, expiry_date, venue, target_audience,
    created_by, review_status, file_hash, created_at
) VALUES (
    'd6000000-0000-0000-0000-000000000006',
    'c6000000-0000-0000-0000-000000000006',
    1,
    'Mandatory Summer Industry Internship Guidelines & NOC Submission',
    'All 6th Semester students must submit company acceptance letters and obtain authorized No-Objection Certificates (NOC) before May 30.',
    NOW() + INTERVAL '30 days',
    NOW(),
    NOW() + INTERVAL '35 days',
    'Department Training & Placement Office',
    'B.Tech CSE - Semester 6',
    'b4000000-0000-0000-0000-000000000004',
    'pending',
    '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
    NOW() - INTERVAL '4 hours'
);

UPDATE notices SET current_version_id = 'd6000000-0000-0000-0000-000000000006' 
WHERE id = 'c6000000-0000-0000-0000-000000000006';

-- 11. Student Notifications & Bookmarks
INSERT INTO saved_notices (user_id, notice_id)
VALUES 
('b5000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001'),
('b5000000-0000-0000-0000-000000000005', 'c3000000-0000-0000-0000-000000000003');

INSERT INTO notifications (user_id, title, message, type, notice_id, is_read, created_at)
VALUES 
(
    'b5000000-0000-0000-0000-000000000005',
    'Revision Notice: Distributed Systems Exam Rescheduled',
    'Exam date updated from Nov 10 to Nov 15. Venue shifted to Auditorium Complex Hall B. Inspect Notice Trust Passport for full diff.',
    'revision',
    'c1000000-0000-0000-0000-000000000001',
    false,
    NOW() - INTERVAL '1 day'
),
(
    'b5000000-0000-0000-0000-000000000005',
    'Event Cancelled: Quantum Computing Lecture',
    'Dr. K. Ramanathan lecture cancelled due to travel emergency. See official cancellation statement.',
    'cancellation',
    'c4000000-0000-0000-0000-000000000004',
    true,
    NOW() - INTERVAL '2 days'
);

-- 12. Student Reports
INSERT INTO notice_reports (
    notice_id, version_id, reporter_id, report_type, description, status, created_at
) VALUES (
    'c1000000-0000-0000-0000-000000000001',
    'd1000000-0000-0000-0000-000000000001',
    'b5000000-0000-0000-0000-000000000005',
    'outdated',
    'A WhatsApp PDF is circulating showing Nov 10 in Hall A, but NoticeTrust shows it was revised to Nov 15 in Hall B. Requesting confirmation.',
    'resolved',
    NOW() - INTERVAL '12 hours'
);

-- 13. Audit Log entries
INSERT INTO audit_logs (actor_id, actor_email, action_type, target_type, target_id, metadata)
VALUES 
(
    'b3000000-0000-0000-0000-000000000003',
    'exam.controller@noticetrust.edu',
    'REVISION_SUBMITTED',
    'notice',
    'c1000000-0000-0000-0000-000000000001',
    '{"version": 2, "changed_fields": ["exam_date", "venue", "description"]}'::jsonb
),
(
    'b2000000-0000-0000-0000-000000000002',
    'dean.academics@noticetrust.edu',
    'REVISION_APPROVED',
    'notice',
    'c1000000-0000-0000-0000-000000000001',
    '{"version": 2, "reviewer": "Prof. Neha Verma", "timestamp": "2026-10-24"}'::jsonb
),
(
    'b2000000-0000-0000-0000-000000000002',
    'dean.academics@noticetrust.edu',
    'NOTICE_CANCELLED',
    'notice',
    'c4000000-0000-0000-0000-000000000004',
    '{"reason": "Speaker travel emergency"}'::jsonb
);
