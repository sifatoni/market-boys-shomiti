import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string; pass: string }) {
    return this.authService.login(body.email, body.pass);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: any) {
    return this.authService.register(body);
  }
}
