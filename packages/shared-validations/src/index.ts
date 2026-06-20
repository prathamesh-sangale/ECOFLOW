import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const AccessRequestSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email format'),
  requested_role: z.string().min(1, 'Role is required'),
  department: z.string().optional(),
  reason: z.string().optional()
});

export const CreateUserSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role_id: z.string().optional(),
  phone: z.string().optional(),
});

export const UpdateUserSchema = z.object({
  full_name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role_id: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
});

export const CreateRoleSchema = z.object({
  role_name: z.string().min(2, 'Role name must be at least 2 characters'),
  description: z.string().optional(),
});

export const UpdateRoleSchema = z.object({
  role_name: z.string().min(2).optional(),
  description: z.string().optional(),
});

export const AssignPermissionSchema = z.object({
  permission_id: z.string().uuid('Invalid permission ID'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type AccessRequestInput = z.infer<typeof AccessRequestSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type CreateRoleInput = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleInput = z.infer<typeof UpdateRoleSchema>;
export type AssignPermissionInput = z.infer<typeof AssignPermissionSchema>;

export const CreateCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
});

export const ProductStatusSchema = z.enum(['Draft', 'Active', 'Archived']);

export const CreateProductSchema = z.object({
  product_code: z.string().min(2, 'Product code is required'),
  product_name: z.string().min(2, 'Product name is required'),
  category_id: z.string().uuid('Invalid category ID'),
  description: z.string().optional(),
  image_url: z.string().url('Invalid URL format').optional(),
  status: ProductStatusSchema.optional(),
});

export const UpdateProductSchema = z.object({
  product_code: z.string().min(2).optional(),
  product_name: z.string().min(2).optional(),
  category_id: z.string().uuid().optional(),
  description: z.string().optional(),
  image_url: z.string().url().optional(),
  status: ProductStatusSchema.optional(),
});

export const AttachmentUploadSchema = z.object({
  file_name: z.string().min(1),
  file_url: z.string().url(),
  file_type: z.string(),
});

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type AttachmentUploadInput = z.infer<typeof AttachmentUploadSchema>;

export const BOMStatusSchema = z.enum(['Draft', 'Active', 'Archived']);

export const CreateBOMSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  bom_code: z.string().min(2, 'BOM code is required'),
  bom_name: z.string().min(2, 'BOM name is required'),
  description: z.string().optional(),
  status: BOMStatusSchema.optional(),
});

export const UpdateBOMSchema = z.object({
  bom_code: z.string().min(2).optional(),
  bom_name: z.string().min(2).optional(),
  description: z.string().optional(),
  status: BOMStatusSchema.optional(),
});

export const CreateComponentSchema = z.object({
  component_name: z.string().min(2, 'Component name is required'),
  material_type: z.string().min(1, 'Material type is required'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  unit_cost: z.number().min(0, 'Unit cost must be at least 0'),
  notes: z.string().optional(),
});

export const UpdateComponentSchema = z.object({
  component_name: z.string().min(2).optional(),
  material_type: z.string().min(1).optional(),
  quantity: z.number().positive().optional(),
  unit: z.string().min(1).optional(),
  unit_cost: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export type CreateBOMInput = z.infer<typeof CreateBOMSchema>;
export type UpdateBOMInput = z.infer<typeof UpdateBOMSchema>;
export type CreateComponentInput = z.infer<typeof CreateComponentSchema>;
export type UpdateComponentInput = z.infer<typeof UpdateComponentSchema>;

export const ECOPrioritySchema = z.enum(['Low', 'Medium', 'High', 'Critical']);
export const ECOStatusSchema = z.enum(['Draft', 'Submitted', 'Under Review', 'Changes Requested', 'Approved', 'Rejected', 'Cancelled']);
export const ImpactTypeSchema = z.enum(['Cost', 'Material', 'Manufacturing', 'Quality']);

export const CreateECOSchema = z.object({
  eco_number: z.string().min(1, 'ECO number is required'),
  product_id: z.string().uuid('Invalid product ID'),
  bom_id: z.string().uuid('Invalid BOM ID'),
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  reason: z.string().optional(),
  priority: ECOPrioritySchema.optional(),
});

export const UpdateECOSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().optional(),
  reason: z.string().optional(),
  priority: ECOPrioritySchema.optional(),
  status: ECOStatusSchema.optional(),
});

export const CreateChangeSchema = z.object({
  change_type: z.string().min(1, 'Change type is required'),
  field_name: z.string().min(1, 'Field name is required'),
  old_value: z.string().optional(),
  new_value: z.string().optional(),
  impact_type: ImpactTypeSchema,
});

export const CreateCommentSchema = z.object({
  comment: z.string().min(1, 'Comment is required'),
});

export type CreateECOInput = z.infer<typeof CreateECOSchema>;
export type UpdateECOInput = z.infer<typeof UpdateECOSchema>;
export type CreateChangeInput = z.infer<typeof CreateChangeSchema>;
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;

export const ApproveSchema = z.object({
  review_notes: z.string().min(1, 'Review notes are required for approval'),
});

export const RejectSchema = z.object({
  review_notes: z.string().min(1, 'Review notes are required for rejection'),
});

export const RequestChangesSchema = z.object({
  review_notes: z.string().min(1, 'Detailed notes are required when requesting changes'),
});

export const AssignReviewerSchema = z.object({
  reviewer_id: z.string().uuid('Invalid reviewer ID'),
});

export const ApprovalCommentSchema = z.object({
  comment: z.string().min(1, 'Comment cannot be empty'),
});

export type ApproveInput = z.infer<typeof ApproveSchema>;
export type RejectInput = z.infer<typeof RejectSchema>;
export type RequestChangesInput = z.infer<typeof RequestChangesSchema>;
export type AssignReviewerInput = z.infer<typeof AssignReviewerSchema>;
export type ApprovalCommentInput = z.infer<typeof ApprovalCommentSchema>;

export const GenerateVersionSchema = z.object({
  release_notes: z.string().optional(),
});

export type GenerateVersionInput = z.infer<typeof GenerateVersionSchema>;

export const AuditFilterSchema = z.object({
  entity_type: z.string().optional(),
  action: z.string().optional(),
  performed_by: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export type AuditFilterInput = z.infer<typeof AuditFilterSchema>;

export const ReportFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().optional(),
  userId: z.string().optional(),
  productId: z.string().optional(),
  priority: z.string().optional(),
});

export type ReportFilterInput = z.infer<typeof ReportFilterSchema>;
