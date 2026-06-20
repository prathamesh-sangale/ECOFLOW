export interface User {
  id: string;
  full_name: string;
  email: string;
  role_id: string | null;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
  created_at: string | Date;
  updated_at: string | Date;
  role?: Role;
}

export interface Role {
  id: string;
  role_name: string;
  description: string | null;
}

export interface Permission {
  id: string;
  permission_name: string;
}

export interface Session {
  id: string;
  user_id: string;
  device_name: string | null;
  ip_address: string | null;
  expires_at: string | Date;
  created_at: string | Date;
}

export interface AccessRequest {
  id: string;
  full_name: string;
  email: string;
  requested_role: string;
  department: string | null;
  reason: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string | Date;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
