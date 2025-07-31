// auth.models.ts

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  success: boolean;
  message: string;
  data: {
    userId: string | null;
    userName: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    userRole?: string;  // Optional since your response might not include it
    profileImageUrl?: string;
    isProfileComplete?: boolean;
    createdAt?: string;
    // Add camelCase versions for backward compatibility
    UserId?: string | null;
    UserName?: string;
    Email?: string;
    AccessToken?: string;
    RefreshToken?: string;
    UserRole?: string;
    ProfileImageUrl?: string;
    CreatedAt?: string;
  };
  errors: null;
  statusCode: number;
}

export interface LogoutRequestDto {
  refreshToken: string;
}

export interface RegisterDto {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: number; 
}

export interface RegisterResponseDto {
  success: boolean;
  userName: string;
  email: string;
  message: string;
  verificationToken?: string;
}
export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  profileImageUrl?: string;
  isProfileComplete: boolean;
  createdAt: string;
}
export enum UserEnum {
  Student = 0,
  Reviewer = 1, 
  Admin = 2
}
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterDto) => Promise<RegisterResponseDto>; // Changed from Promise<void>
  logout: () => void;
  isLoading: boolean;
}

export enum AccountStatus {
  Active = 'Active',
  PendingVerification = 'PendingVerification',
  LockedOut = 'LockedOut',
  Blocked = 'Blocked'
}