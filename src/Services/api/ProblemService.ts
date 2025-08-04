import api from "./apiService";
import { Problem, ProblemDetail } from "@/Models";
import { ApiResponse } from "@/Models/api";

export const problemsApi = {
  getProblems: async () : Promise<ApiResponse<Problem[]>> => {
    const response = await api.get('/problems');
    return response.data;},

  getProblem : async (id: number): Promise<ApiResponse<ProblemDetail>> => {
    const response = await api.get(`/problems/${id}`);
    return response.data;},
};