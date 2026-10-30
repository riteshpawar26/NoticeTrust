-- NoticeTrust Row Level Security (RLS) Policies
-- Enforces role-based data boundaries at the PostgreSQL engine level

ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE publisher_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notice_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notice_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notice_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notice_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflict_resolutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE authenticity_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notice_read_events ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION get_auth_role()
RETURNS VARCHAR AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. INSTITUTIONS: Publicly readable, modifiable only by super_admin
CREATE POLICY "Institutions are viewable by all users" 
    ON institutions FOR SELECT USING (true);

CREATE POLICY "Super admins can manage institutions" 
    ON institutions FOR ALL USING (get_auth_role() = 'super_admin');

-- 2. PROFILES: View own profile or directory, update own
CREATE POLICY "Users can view all verified profiles in institution" 
    ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE USING (auth.uid() = id);

-- 3. NOTICES:
-- Students view only approved notices
CREATE POLICY "Public & students can view approved notices" 
    ON notices FOR SELECT 
    USING (status IN ('approved', 'upcoming', 'active', 'expired', 'cancelled', 'superseded')
           OR created_by = auth.uid() 
           OR get_auth_role() IN ('admin', 'super_admin'));

CREATE POLICY "Publishers can insert notices" 
    ON notices FOR INSERT 
    WITH CHECK (auth.uid() = created_by AND get_auth_role() IN ('publisher', 'admin', 'super_admin'));

CREATE POLICY "Publishers can update their own draft notices" 
    ON notices FOR UPDATE 
    USING (created_by = auth.uid() AND status = 'draft');

CREATE POLICY "Admins can update any notice" 
    ON notices FOR UPDATE 
    USING (get_auth_role() IN ('admin', 'super_admin'));

-- 4. NOTICE VERSIONS:
CREATE POLICY "Public & students view approved versions" 
    ON notice_versions FOR SELECT 
    USING (review_status = 'approved' 
           OR created_by = auth.uid() 
           OR get_auth_role() IN ('admin', 'super_admin'));

CREATE POLICY "Publishers can insert new versions" 
    ON notice_versions FOR INSERT 
    WITH CHECK (auth.uid() = created_by AND get_auth_role() IN ('publisher', 'admin', 'super_admin'));

CREATE POLICY "Admins can update notice versions (approvals, feedback)" 
    ON notice_versions FOR UPDATE 
    USING (get_auth_role() IN ('admin', 'super_admin'));

-- 5. ATTACHMENTS:
CREATE POLICY "Attachments visible if version is visible" 
    ON notice_attachments FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM notice_versions nv 
        WHERE nv.id = notice_attachments.version_id 
        AND (nv.review_status = 'approved' OR nv.created_by = auth.uid() OR get_auth_role() IN ('admin', 'super_admin'))
    ));

-- 6. SAVED NOTICES & SUBSCRIPTIONS:
CREATE POLICY "Users manage their own bookmarks" 
    ON saved_notices FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage their own subscriptions" 
    ON subscriptions FOR ALL USING (auth.uid() = user_id);

-- 7. NOTIFICATIONS:
CREATE POLICY "Users view and manage their own notifications" 
    ON notifications FOR ALL USING (auth.uid() = user_id);

-- 8. NOTICE REPORTS:
CREATE POLICY "Students can submit reports" 
    ON notice_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Students can view their submitted reports" 
    ON notice_reports FOR SELECT 
    USING (auth.uid() = reporter_id OR get_auth_role() IN ('admin', 'super_admin'));

CREATE POLICY "Admins can update report statuses" 
    ON notice_reports FOR UPDATE USING (get_auth_role() IN ('admin', 'super_admin'));

-- 9. AUDIT LOGS: Append-only for all, readable only by admins
CREATE POLICY "Admins can view audit logs" 
    ON audit_logs FOR SELECT USING (get_auth_role() IN ('admin', 'super_admin'));

CREATE POLICY "Authenticated users can insert audit logs" 
    ON audit_logs FOR INSERT WITH CHECK (auth.uid() = actor_id);

-- 10. CONFLICTS: Visible and manageable only by admins
CREATE POLICY "Admins can view and manage conflicts" 
    ON notice_conflicts FOR ALL USING (get_auth_role() IN ('admin', 'super_admin'));

-- 11. AUTHENTICITY CHECKS: Users view their own checks
CREATE POLICY "Users view their own authenticity checks" 
    ON authenticity_checks FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
