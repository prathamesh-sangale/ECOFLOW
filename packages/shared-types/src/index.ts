export interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  profile_image?: string | null;
  role_id?: string | null;
  status: UserStatus;
  last_login?: Date | null;
  created_at: Date;
  updated_at: Date;
  role?: Role | null;
}

export type UserStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface Role {
  id: string;
  role_name: string;
  description?: string | null;
  created_at: Date;
  permissions?: Permission[];
}

export interface Permission {
  id: string;
  permission_name: string;
  module_name: string;
  description?: string | null;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  action: string;
  details?: string;
  created_at: Date;
}

export type ProductStatus = 'Draft' | 'Active' | 'Archived';

export interface ProductCategory {
  id: string;
  name: string;
  description?: string | null;
  created_at: Date;
}

export interface Product {
  id: string;
  product_code: string;
  product_name: string;
  category_id: string;
  description?: string | null;
  image_url?: string | null;
  status: ProductStatus;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  category?: ProductCategory;
  creator?: User;
  attachments?: ProductAttachment[];
}

export interface ProductAttachment {
  id: string;
  product_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_by: string;
  uploaded_at: Date;
  uploader?: User;
}

export interface ProductActivity {
  id: string;
  product_id: string;
  action: string;
  details?: string;
  user_id: string;
  created_at: Date | string;
  user?: Partial<User>;
}

export type BOMStatus = 'Draft' | 'Active' | 'Archived';
export type MaterialType = 'Wood' | 'Metal' | 'Plastic' | 'Fabric' | 'Hardware' | 'Other';

export interface BOMComponent {
  id: string;
  bom_id: string;
  component_name: string;
  material_type: MaterialType | string;
  quantity: number;
  unit: string;
  unit_cost: number;
  total_cost: number;
  notes?: string;
  created_at: Date | string;
}

export interface BOMActivity {
  id: string;
  bom_id: string;
  action: string;
  metadata?: string;
  user_id: string;
  created_at: Date | string;
  user?: Partial<User>;
}

export interface BOM {
  id: string;
  product_id: string;
  bom_code: string;
  bom_name: string;
  description?: string;
  status: BOMStatus | string;
  created_by: string;
  created_at: Date | string;
  updated_at: Date | string;

  product?: Partial<Product>;
  creator?: Partial<User>;
  components?: BOMComponent[];
  activities?: BOMActivity[];
}

export interface CostSummary {
  totalMaterialCost: number;
  totalComponents: number;
  averageComponentCost: number;
}

export type ECOPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ECOStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Changes Requested' | 'Approved' | 'Rejected' | 'Cancelled';
export type ImpactType = 'Cost' | 'Material' | 'Manufacturing' | 'Quality';

export type ApprovalDecision = 'Approved' | 'Rejected' | 'Changes Requested';

export interface ApprovalActivity {
  id: string;
  approval_id: string;
  action: string;
  metadata?: string;
  performed_by: string;
  created_at: Date | string;
  user?: Partial<User>;
}

export interface ApprovalComment {
  id: string;
  approval_id: string;
  user_id: string;
  comment: string;
  created_at: Date | string;
  user?: Partial<User>;
}

export interface Approval {
  id: string;
  eco_id: string;
  reviewer_id: string;
  decision?: ApprovalDecision | string;
  review_notes?: string;
  reviewed_at?: Date | string;
  created_at: Date | string;
  
  eco?: Partial<ECO>;
  reviewer?: Partial<User>;
  activities?: ApprovalActivity[];
  comments?: ApprovalComment[];
}

export interface ECOChange {
  id: string;
  eco_id: string;
  change_type: string;
  field_name: string;
  old_value?: string;
  new_value?: string;
  impact_type: ImpactType | string;
  created_at: Date | string;
}

export interface ECOComment {
  id: string;
  eco_id: string;
  user_id: string;
  comment: string;
  created_at: Date | string;
  user?: Partial<User>;
}

export interface ECOAttachment {
  id: string;
  eco_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_by: string;
  uploaded_at: Date | string;
  uploader?: Partial<User>;
}

export interface ECOActivity {
  id: string;
  eco_id: string;
  action: string;
  metadata?: string;
  user_id: string;
  created_at: Date | string;
  user?: Partial<User>;
}

export interface ECO {
  id: string;
  eco_number: string;
  product_id: string;
  bom_id: string;
  title: string;
  description?: string;
  reason?: string;
  priority: ECOPriority | string;
  status: ECOStatus | string;
  submitted_by: string;
  reviewed_by?: string;
  created_at: Date | string;
  updated_at: Date | string;

  product?: Partial<Product>;
  bom?: Partial<BOM>;
  submitter?: Partial<User>;
  reviewer?: Partial<User>;

  changes?: ECOChange[];
  comments?: ECOComment[];
  attachments?: ECOAttachment[];
  activities?: ECOActivity[];
}

export interface ProductVersion {
  id: string;
  product_id: string;
  version_number: string;
  eco_id: string;
  release_notes?: string;
  snapshot: any;
  created_by: string;
  is_active: boolean;
  created_at: Date | string;
  
  product?: Partial<Product>;
  eco?: Partial<ECO>;
  creator?: Partial<User>;
}

export interface BOMVersion {
  id: string;
  bom_id: string;
  version_number: string;
  eco_id: string;
  release_notes?: string;
  snapshot: any;
  created_by: string;
  is_active: boolean;
  created_at: Date | string;

  bom?: Partial<BOM>;
  eco?: Partial<ECO>;
  creator?: Partial<User>;
}

export interface VersionRelease {
  id: string;
  product_version_id: string;
  bom_version_id: string;
  release_date: Date | string;
  released_by: string;
  notes?: string;

  product_version?: Partial<ProductVersion>;
  bom_version?: Partial<BOMVersion>;
  releaser?: Partial<User>;
}

export interface VersionActivity {
  id: string;
  product_version_id: string;
  action: string;
  metadata?: string;
  user_id: string;
  created_at: Date | string;

  product_version?: Partial<ProductVersion>;
  user?: Partial<User>;
}

export interface AuditLog {
  id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  old_value?: any;
  new_value?: any;
  performed_by: string;
  ip_address?: string;
  user_agent?: string;
  performed_at: Date | string;

  user?: Partial<User>;
}

export interface LoginAudit {
  id: string;
  user_id: string;
  action: string;
  ip_address?: string;
  device?: string;
  created_at: Date | string;

  user?: Partial<User>;
}

export interface EngineerDashboard {
  totalProducts: number;
  totalBoms: number;
  draftEcos: number;
  pendingReviews: number;
  approvedEcos: number;
  rejectedEcos: number;
  recentProducts: Partial<Product>[];
  recentActivities: Partial<ECOActivity>[];
}

export interface ApproverDashboard {
  pendingReviews: number;
  approvalsThisMonth: number;
  rejectionsThisMonth: number;
  averageReviewTimeHours: number;
  highPriorityRequests: number;
  approvalQueue: Partial<ECO>[];
  recentReviews: Partial<Approval>[];
}

export interface ProductionDashboard {
  activeVersions: number;
  recentReleases: number;
  productsReleased: number;
  pendingReleases: number;
  versionChanges: number;
  releaseTimeline: Partial<VersionRelease>[];
  activeProductVersions: Partial<ProductVersion>[];
}

export interface AdminDashboard {
  totalUsers: number;
  activeUsers: number;
  totalProducts: number;
  totalBoms: number;
  totalEcos: number;
  totalApprovals: number;
  totalVersions: number;
  totalAuditEvents: number;
  recentAuditEvents: Partial<AuditLog>[];
}

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  status?: string;
  userId?: string;
  productId?: string;
  priority?: string;
}

export interface ReportExport {
  format: 'csv';
  data: any[];
}
