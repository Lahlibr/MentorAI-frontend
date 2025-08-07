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
  input: string;
  expectedOutput: string;
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
