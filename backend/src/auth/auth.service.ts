import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return null;
    }

    return { email: user.email, id: user._id.toString() };
  }

  async signup(email: string, password: string): Promise<any> {
    try {
      // Check if user already exists
      const existingUser = await this.usersService.findByEmail(email);
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      // Create new user
      const user = await this.usersService.create(email, password);
      
      // Return user info and token
      return this.login({ email: user.email, id: user._id.toString() });
    } catch (error) {
      // Re-throw ConflictException
      if (error instanceof ConflictException) {
        throw error;
      }
      // Handle other errors (like database connection issues)
      console.error('Signup error:', error);
      throw new ConflictException('Failed to create user. Please try again later.');
    }
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

