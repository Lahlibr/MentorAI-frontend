// src/types/Analytics.ts
export interface StudentAnalytics {
  studentId: number;
  studentName: string;
  problemsSolved: number;
  totalAttempts: number;
  averageTimeToSolve: number;
  successRate: number;
  problemPerformances: ProblemPerformance[];
}

export interface ProblemPerformance {
  problemId: number;
  problemTitle: string;
  status: 'Solved' | 'Attempted' | 'Not Attempted';
  attempts: number;
  timeSpent: number;
  wrongSubmissions: number;
  firstAttemptTime?: string;
  solvedTime?: string;
}

export interface Leaderboard {
  entries: LeaderboardEntry[];
  totalStudents: number;
}

export interface LeaderboardEntry {
  rank: number;
  studentId: number;
  studentName: string;
  problemsSolved: number;
  averageTime: number;
  totalAttempts: number;
  successRate: number;
}
