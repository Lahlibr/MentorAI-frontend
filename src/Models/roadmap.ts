// roadmap.models.ts
import { CreateModuleDto, ModuleDto } from './modules';

export interface AssignModulesDto {
  moduleIds: number[];
}

export interface CreateRoadmapDto {
  title: string;
  description?: string;
  modules?: CreateModuleDto[];
}

export interface RoadmapDto {
  id: number;
  studentId: number;
  generatedOn: Date;
  isActive: boolean;
  title: string;
  description?: string;
  modules: ModuleDto[];
  enrolledCount: number;
  progressPercentage: number;
}

export interface UpdateRoadmapDto {
  title?: string;
  description?: string;
  isActive?: boolean;
}