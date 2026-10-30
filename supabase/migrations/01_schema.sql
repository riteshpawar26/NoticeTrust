-- NoticeTrust Database Schema Migration
-- Verified & Time-Aware Local Information System
-- Seva First Innovation Challenge 2026

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. INSTITUTIONS
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    domain VARCHAR(100),
    address TEXT,
    logo_url TEXT,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    contact_email VARCHAR(255),
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES (Extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('student', 'publisher', 'admin', 'super_admin')),
    institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL,
    department VARCHAR(100),
    semester VARCHAR(20),
    student_id VARCHAR(50),
    phone VARCHAR(30),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PUBLISHER PERMISSIONS
CREATE TABLE IF NOT EXISTS publisher_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    department VARCHAR(100),
    allowed_categories TEXT[] DEFAULT ARRAY['Examination', 'Admissions', 'Scholarships', 'Results', 'Timetable', 'Events', 'General'],
    can_publish_without_approval BOOLEAN DEFAULT false,
    granted_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. NOTICES (Master Notice Pointer)
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notice_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. NT-2026-ENG-0842
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    semester VARCHAR(20) DEFAULT 'All',
    current_version_id UUID, -- References notice_versions(id)
    status VARCHAR(30) NOT NULL DEFAULT 'draft' 
        CHECK (status IN ('draft', 'pending_review', 'approved', 'upcoming', 'active', 'expired', 'cancelled', 'superseded')),
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. NOTICE VERSIONS (Immutable historical snapshots)
CREATE TABLE IF NOT EXISTS notice_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notice_id UUID NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMPTZ,
    exam_date TIMESTAMPTZ,
    deadline TIMESTAMPTZ,
    effective_date TIMESTAMPTZ NOT NULL,
    expiry_date TIMESTAMPTZ,
    venue VARCHAR(255),
    target_audience VARCHAR(255),
    changes_summary TEXT,
    created_by UUID NOT NULL REFERENCES profiles(id),
    reviewer_id UUID REFERENCES profiles(id),
    review_status VARCHAR(30) NOT NULL DEFAULT 'draft' 
        CHECK (review_status IN ('draft', 'pending', 'approved', 'rejected', 'superseded')),
    review_feedback TEXT,
    reviewed_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    file_hash VARCHAR(64), -- SHA-256
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(notice_id, version_number)
);

-- Add foreign key constraint to notices.current_version_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_notices_current_version'
    ) THEN
        ALTER TABLE notices ADD CONSTRAINT fk_notices_current_version 
            FOREIGN KEY (current_version_id) REFERENCES notice_versions(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 6. NOTICE ATTACHMENTS
CREATE TABLE IF NOT EXISTS notice_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version_id UUID NOT NULL REFERENCES notice_versions(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    sha256_hash VARCHAR(64) NOT NULL,
    extracted_text TEXT,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NOTICE REPORTS (Student reporting system)
CREATE TABLE IF NOT EXISTS notice_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notice_id UUID NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
    version_id UUID REFERENCES notice_versions(id) ON DELETE SET NULL,
    reporter_id UUID NOT NULL REFERENCES profiles(id),
    report_type VARCHAR(50) NOT NULL 
        CHECK (report_type IN ('outdated', 'suspicious_altered', 'duplicate', 'conflicting', 'incorrect_info', 'broken_link', 'other')),
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    reviewer_id UUID REFERENCES profiles(id),
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MODERATION ACTIONS (Auditable moderation decisions)
CREATE TABLE IF NOT EXISTS moderation_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notice_id UUID NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
    version_id UUID REFERENCES notice_versions(id) ON DELETE SET NULL,
    reviewer_id UUID NOT NULL REFERENCES profiles(id),
    action_type VARCHAR(50) NOT NULL 
        CHECK (action_type IN ('approve', 'reject', 'request_changes', 'cancel', 'supersede', 'resolve_conflict')),
    reason TEXT,
    previous_status VARCHAR(30),
    new_status VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SAVED NOTICES (Student bookmarks)
CREATE TABLE IF NOT EXISTS saved_notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    notice_id UUID NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, notice_id)
);

-- 10. SUBSCRIPTIONS (Personalized feeds)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    department VARCHAR(100),
    category VARCHAR(50),
    notify_revisions BOOLEAN DEFAULT true,
    notify_cancellations BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AUDIT LOGS (Immutable security trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    actor_email VARCHAR(255),
    action_type VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID,
    correlation_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. NOTICE CONFLICTS (Cross-Notice Conflict Radar)
CREATE TABLE IF NOT EXISTS notice_conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notice_a_id UUID NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
    version_a_id UUID NOT NULL REFERENCES notice_versions(id) ON DELETE CASCADE,
    notice_b_id UUID NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
    version_b_id UUID NOT NULL REFERENCES notice_versions(id) ON DELETE CASCADE,
    conflict_type VARCHAR(50) NOT NULL 
        CHECK (conflict_type IN ('exam_date_overlap', 'venue_clash', 'conflicting_deadline', 'duplicate_content')),
    conflicting_fields JSONB NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(30) NOT NULL DEFAULT 'detected' 
        CHECK (status IN ('detected', 'confirmed', 'resolved', 'false_positive')),
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_by UUID REFERENCES profiles(id),
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ
);

-- 13. CONFLICT RESOLUTIONS
CREATE TABLE IF NOT EXISTS conflict_resolutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conflict_id UUID NOT NULL REFERENCES notice_conflicts(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id),
    decision VARCHAR(50) NOT NULL 
        CHECK (decision IN ('resolved', 'false_positive', 'publisher_clarification_requested')),
    resolution_notes TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL 
        CHECK (type IN ('revision', 'cancellation', 'deadline', 'conflict_resolution', 'approval', 'report_update')),
    notice_id UUID REFERENCES notices(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. AUTHENTICITY CHECKS (Upload verification history)
CREATE TABLE IF NOT EXISTS authenticity_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    file_name VARCHAR(255),
    file_hash VARCHAR(64),
    extracted_text_snippet TEXT,
    detected_notice_id VARCHAR(50),
    result_status VARCHAR(50) NOT NULL 
        CHECK (result_status IN ('exact_match_current', 'older_superseded_version', 'possible_mismatch', 'potential_conflict', 'unable_to_verify')),
    matched_notice_id UUID REFERENCES notices(id) ON DELETE SET NULL,
    matched_version_id UUID REFERENCES notice_versions(id) ON DELETE SET NULL,
    match_confidence NUMERIC(5,2),
    detected_differences JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. NOTICE READ EVENTS
CREATE TABLE IF NOT EXISTS notice_read_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    notice_id UUID NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
    version_id UUID REFERENCES notice_versions(id) ON DELETE SET NULL,
    read_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for fast retrieval & search
CREATE INDEX IF NOT EXISTS idx_notices_status ON notices(status);
CREATE INDEX IF NOT EXISTS idx_notices_institution ON notices(institution_id);
CREATE INDEX IF NOT EXISTS idx_notices_department ON notices(department);
CREATE INDEX IF NOT EXISTS idx_notices_category ON notices(category);
CREATE INDEX IF NOT EXISTS idx_notice_versions_notice ON notice_versions(notice_id);
CREATE INDEX IF NOT EXISTS idx_notice_versions_status ON notice_versions(review_status);
CREATE INDEX IF NOT EXISTS idx_notice_reports_status ON notice_reports(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_conflicts_status ON notice_conflicts(status);
