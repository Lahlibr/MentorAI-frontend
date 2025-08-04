// src/types/Problem.ts
export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ProblemDetail extends Problem {
  sampleTestCases: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}
