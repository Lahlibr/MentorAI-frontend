// import { StudentProfileDto } from "@/Models";
// import {apiCall} from "./api";

// export class StudentService{
//   static async getProfile():Promise<StudentProfileDto>{
//     return apiCall<StudentProfileDto>('/students/profile');
//   }

//   static async updateProfile(data:CreateStudentRequest):Promise<StudentProfileDto>{
//     return apiCall<StudentProfileDto>('/students/profile', {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     });
//   }
//   static async getStats():Promise<any>{
//     return apiCall<any>('/students/stats');
//   }
// }