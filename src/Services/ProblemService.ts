// export class ProblemService {
//   static async getAll():Promise<ProblemDto[]> {
//     return apiCall<ProblemDto[]>('/problems');
//   }
//   static async getById(id: string):Promise<ProblemDto> {
//     return apiCall<ProblemDto>(`/problems/${id}`);
//   }
//   static async create(data: CreateProblemRequest):Promise<ProblemDto> {
//     return apiCall<ProblemDto>('/problems', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   }
//   static async update(id: string, data: UpdateProblemRequest):Promise<ProblemDto> {
//     return apiCall<ProblemDto>(`/problems/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     });
//   }
//   static async delete(id: string):Promise<void> {
//     return apiCall<void>(`/problems/${id}`, {
//       method: 'DELETE',
//     });
//   }