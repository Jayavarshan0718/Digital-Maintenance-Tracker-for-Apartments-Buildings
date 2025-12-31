export interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'resident' | 'technician' | 'admin';
  phoneNumber?: string;
  apartmentNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceRequest {
  id: number;
  residentId: number;
  technicianId?: number;
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'general' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  mediaUrls?: string[];
  workNotes?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRequestDto {
  title: string;
  description: string;
  category: string;
  priority: string;
}

export interface UpdateRequestStatusDto {
  status: string;
  workNotes?: string;
}

export interface AssignTechnicianDto {
  technicianId: number;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'resident' | 'technician';
  phoneNumber?: string;
  apartmentNumber?: string;
}