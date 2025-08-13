import { apiCall } from "@/api/ApiCall";
import { LoginDto, RegisterDto, LoginResponseDto, RegisterResponseDto } from "@/Models";

export class AuthService {
  static async login(data: LoginDto): Promise<LoginResponseDto> {
    return apiCall<LoginResponseDto>('post', '/auth/login', data);
  }

  static async register(data: RegisterDto): Promise<RegisterResponseDto> {
    return apiCall<RegisterResponseDto>('post', '/auth/register', {
      userName: data.userName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      role: Number(data.role) // Ensure role is a number
    });
  }

  static async getCurrentUser(): Promise<any> {
    return apiCall<any>('get', '/auth/me');
  }

  static async logout(userId: string, refreshToken: string): Promise<void> {
    return apiCall<void>('post', '/auth/logout', {
      userId,
      refreshToken
    });
  }
}
