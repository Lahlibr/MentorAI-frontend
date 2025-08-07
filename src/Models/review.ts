import { BaseUserProfileDto } from "./User";
export interface Review extends BaseUserProfileDto {
  problemId: number;
  reviewerId: number;
  studentId: number;
  score: number;
  title: string;
  rating: number;
  feedback: string;
  reviewstatus: 'Pending' | 'Completed';
  problemTitle?: string; 
  studentCode: string;
}