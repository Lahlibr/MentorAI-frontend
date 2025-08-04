// src/types/Submission.ts
export interface CreateSubmissionRequest {
  problemId: number;
  studentId: number;
  code: string;
  language: string;
  problemStartTime: string;
}

export interface SubmissionResult {
  submissionId: number;
  status: string;
  isCorrect: boolean;
  compileError?: string;
  executionTime: number;
  memoryUsed: number;
  testCaseResults: TestCaseResult[];
}

export interface TestCaseResult {
  testCaseId: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  errorDetails?: string;
  executionTime: number;
  isHidden: boolean;
}

export interface SubmissionStatus {
  submissionId: number;
  status: string;
  message: string;
  result?: SubmissionResult;
}
