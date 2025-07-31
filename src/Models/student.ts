// student.models.ts

import { BaseUserProfileDto } from './base';
import { AccountStatus } from './auth';

export interface StudentProfileDto extends BaseUserProfileDto {
  age?: number;
  graduation: string;
  graduationYear: number;
  university?: string;
  major?: string;
  overallMarks: number;
  problemsSolvedCount: number;
  totalChallengesAttempted: number;
  currentRoadmapTitle?: string;
  currentRoadmapProgressPercentage: number;
  lastActiveModuleTitle?: string;
  lastActivityDate?: Date;
  certificationsEarnedCount: number;
  status: AccountStatus;
  isEmailVerified: boolean;
  assessmentScore?: number;
  currentLearningGoal?: string;
  badgesEarnedCount: number;
  guardianName: string;
  guardianEmail?: string;
  guardianPhoneNumber: string;
  guardianRelationship: string;
}

export interface StudentUpdateDto {
  age: number;
  phoneNumber: string;
  graduation: string;
  graduationYear: number;
  university?: string;
  major?: string;
  profileImageUrl?: string;
  guardianPhoneNumber: string;
  guardianName: string;
  guardianEmail: string;
  guardianRelationship: string;
}