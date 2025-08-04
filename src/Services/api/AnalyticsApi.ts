import { ApiResponse } from "@/Models/api";
import api from "./apiService";
import { Leaderboard } from "@/Models/Analytics";


export const analyticsApi = {
  getStudentAnalytics: async (studentId: number): Promise<ApiResponse<any>> => {
    const response = await api.get(`/analytics/students/${studentId}`);
    return response.data;
  },
   downloadStudentAnalyticsCsv: async (studentId: number): Promise<void> => {
    const response = await api.get(`/analytics/students/${studentId}/csv`,{
      responseType: 'blob',});

   const url = window.URL.createObjectURL(new Blob([response.data]));
   const link = document.createElement('a');
   link.href = url;
    link.setAttribute('download', `student_${studentId}_analytics.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  getLeaderboard: async (problemId?: number): Promise<Leaderboard> => {
    const params = problemId ? { problemId } : {};
    const response = await api.get('/analytics/leaderboard', { params });
    return response.data;
  }
};

    