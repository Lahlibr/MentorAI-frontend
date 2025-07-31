// base.models.ts

import { UserEnum } from './auth';
import { AccountStatus } from './auth';
export interface BaseUserProfileDto {
  id: number;
  userName: string;
  email: string;
  userRole: UserEnum;
  emailVerified: boolean;
  status: AccountStatus;
  profileImageUrl?: string;
  phoneNumber?: string;
  twoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}