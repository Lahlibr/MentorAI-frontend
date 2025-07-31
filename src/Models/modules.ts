// module.models.ts

export interface CreateModuleDto {
  title: string;
  description?: string;
  resourceType: string;
  resourceIdentifier: string;
  prerequisites?: string;
}

export interface ModuleDto {
  id: number;
  roadmapId: number;
  title: string;
  description?: string;
  resourceType: string;
  resourceIdentifier: string;
  status: string;
  prerequisites?: string;
}

export interface UpdateModuleDto {
  title?: string;
  description?: string;
  resourceType?: string;
  resourceIdentifier?: string;
  status?: string;
  prerequisites?: string;
}