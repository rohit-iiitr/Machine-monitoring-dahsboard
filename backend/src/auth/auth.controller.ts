import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('signup')
  async signup(@Body() signupDto: { email: string; password: string }) {
    if (!signupDto.email || !signupDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    if (signupDto.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    return this.authService.signup(signupDto.email, signupDto.password);
  }
}

