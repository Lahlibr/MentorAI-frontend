import api from "./apiService";
import { ApiResponse } from "@/Models/api";
import { CreateSubmissionRequest, SubmissionStatus } from "@/Models/Submission";

export const submissionsApi = {
  submitCode: async (submission: CreateSubmissionRequest):Promise<ApiResponse<SubmissionStatus>> => {
    const response = await api.post('/submissions', submission);
    return response.data;
  },
  getSubmissionStatus: async (submissionId: number): Promise<ApiResponse<SubmissionStatus>> => {
    const response = await api.get(`/submissions/${submissionId}/status`);
    return response.data;
  },
};