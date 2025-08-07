// reviewer.models.ts
import { BaseUserProfileDto } from './User';

export interface ReviewerAvailabilityDto {
  day: DayEnum;
  startTime: string; // or Date if you'll convert it
  endTime: string; // or Date if you'll convert it
  isAvailable: boolean;
}

export enum DayEnum {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday'
}

export interface ReviewerProfileDto extends BaseUserProfileDto {
  totalReviewsConducted: number;
  bio: string;
  yearsOfExperience: number;
  availability: string;
  expertiseAreasJson: string;
  averageRating: number;
}

export interface ReviewerUpdateDto {
  phoneNumber: string;
  qualification: string;
  bio: string;
  yearsOfExperience: number;
  expertiseAreasJson: string;
}