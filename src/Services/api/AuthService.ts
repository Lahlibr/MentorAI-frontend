import { apiCall } from "@/api/ApiCall";
import { LoginDto, RegisterDto, LoginResponseDto, RegisterResponseDto, UserEnum } from "@/Models";

export class AuthService {
  static async login(data: LoginDto): Promise<LoginResponseDto> {
    return apiCall<LoginResponseDto>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async register(data: RegisterDto): Promise<RegisterResponseDto> {
    console.log('Sending registration data:', data); // Debug log
    
    return apiCall<RegisterResponseDto>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        userName: data.userName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: Number(data.role) // Ensure it's a number
      })
    });
  }

  static async getCurrentUser(): Promise<any> {
    return apiCall<any>('/auth/me', {
      method: 'GET'
    });
  }

  static async logout(userId: string, refreshToken: string): Promise<void> {
    return apiCall<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ userId, refreshToken })
    });
  }
}