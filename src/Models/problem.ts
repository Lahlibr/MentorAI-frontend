import { ProblemPerformance } from "./Analytics";

// src/types/Problem.ts
export interface Problem {
  id: number;
  title: string;
  description: string;
  category: string;      
  createdAt: string; 
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sampleInput: string;
  sampleOutput: string;
  constraints: string;
}

export interface ProblemDetail extends Problem {
  sampleTestCases: TestCase[];
}

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}
export interface ProblemCardProps {
  problem: Problem;
  onClick?: () => void;
  showAuthor?: boolean;
  className?: string;
}


export interface Properties {
  id:string;
  performances: ProblemPerformance[];
  problem: Problem;
  onClick?: () => string;
}

export interface SimpleProps {
 
  problem: Problem;
  onClick?: () => string;
}
export interface ProblemFormData {
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  inputFormat: string;
  outputFormat: string;
  timeLimit?: number;
  memoryLimit?: number;
  tags: string[];
  testCases: TestCase[];
  languageSolutions: LanguageSolution[];
  moduleId?: number;
  roadmapId?: number;
  orderInModule?: number;
}
export interface ProblemFormState {
  formData: ProblemFormData;
  originalData: ProblemFormData | null;
  isLoading: boolean;
  errors: Partial<ProblemFormData> | { general?: string };
  isDirty: boolean;
  mode: 'add' | 'edit';
  problemId: number | null;
  status: {
    submit: 'idle' | 'pending' | 'succeeded' | 'failed';
    load: 'idle' | 'pending' | 'succeeded' | 'failed';
    delete: 'idle' | 'pending' | 'succeeded' | 'failed';
  };
}
export interface ProblemFormContextType {
  formData: ProblemFormData;
  isLoading: boolean;
  errors: Record<string, string>; // allow any error keys
  isDirty: boolean;
  updateFormData: (data: Partial<ProblemFormData>) => void;
  addTestCase: () => void;
  removeTestCase: (id: number) => void; // number, not string
  updateTestCase: (id: number, field: keyof TestCase, value: any) => void; // number, not string
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  submitForm: (token: string) => Promise<boolean>;
  resetForm: () => void;
  deleteProblem: (token: string) => Promise<boolean>;
  loadProblemData: (problemId: number, token: string) => Promise<void>;
  setMode: (mode: 'create' | 'edit', problemId?: number) => void; // create/edit instead of add/edit
  mode: 'create' | 'edit';
  problemId: number | null;
  addLanguageSolution: (language: string, template: string) => void;
  removeLanguageSolution: (language: string) => void;
  updateLanguageSolution: (language: string, newTemplate: string) => void;
}

export interface CreateProblemDto {
  title: string;
  description: string;
  difficultyLevel: number;
  imageUrl?: string;
  inputFormat?: string;
  outputFormat?: string;
  exampleTestCasesJson?: string;
  orderInModule?: number;
  moduleId?: number;
  roadmapId?: number;
  category?: string;
  exampleInputsJson?: string;
  exampleOutputsJson?: string;
  hiddenTestCasesJson?: string;
  isActive: boolean;
}

export interface LanguageSolution {
  language: string;
  solutionTemplate: string;
}
export const SUPPORTED_LANGUAGES = [
  { value: 'python', label: 'Python', icon: '🐍', template: '# Write your solution here\ndef solution():\n    pass' },
  { value: 'java', label: 'Java', icon: '☕', template: 'public class Solution {\n    public void solve() {\n        // Write your solution here\n    }\n}' },
  { value: 'cpp', label: 'C++', icon: '⚡', template: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}' },
  { value: 'javascript', label: 'JavaScript', icon: '🟨', template: '// Write your solution here\nfunction solution() {\n    \n}' },
  { value: 'csharp', label: 'C#', icon: '💜', template: 'using System;\n\npublic class Solution {\n    public void Solve() {\n        // Write your solution here\n    }\n}' },
];