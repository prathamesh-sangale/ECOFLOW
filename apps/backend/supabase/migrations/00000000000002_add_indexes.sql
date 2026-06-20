-- Optimization Indexes for ECOFlow Database

-- Products
CREATE INDEX IF NOT EXISTS idx_products_product_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- BOMs
CREATE INDEX IF NOT EXISTS idx_boms_bom_code ON boms(bom_code);
CREATE INDEX IF NOT EXISTS idx_boms_product_id ON boms(product_id);
CREATE INDEX IF NOT EXISTS idx_boms_status ON boms(status);

-- ECOs
CREATE INDEX IF NOT EXISTS idx_ecos_eco_number ON ecos(eco_number);
CREATE INDEX IF NOT EXISTS idx_ecos_status ON ecos(status);
CREATE INDEX IF NOT EXISTS idx_ecos_product_id ON ecos(product_id);
CREATE INDEX IF NOT EXISTS idx_ecos_bom_id ON ecos(bom_id);

-- Approvals
CREATE INDEX IF NOT EXISTS idx_approvals_eco_id ON approvals(eco_id);
CREATE INDEX IF NOT EXISTS idx_approvals_reviewer_id ON approvals(reviewer_id);

-- Versions
CREATE INDEX IF NOT EXISTS idx_product_versions_product_id ON product_versions(product_id);
CREATE INDEX IF NOT EXISTS idx_bom_versions_bom_id ON bom_versions(bom_id);

-- Audit & Traceability
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_performed_by ON audit_logs(performed_by);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
