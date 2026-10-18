import { Controller, Post, Body, Patch, Param, Res, Logger } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { ApiAuth } from '../auth/decorators/api.decorator.js';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

@ApiTags("Employees")
@ApiAuth()
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signUp(@Body() loginUserDto: LoginUserDto) {
    return this.authService.registerUser(loginUserDto);
  }

  @Post("login")
  async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.loginUser(loginUserDto);
    const isProduction = process.env.NODE_ENV === "production";
    response.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24
    });
    // console.log(response);
    this.logger.log("Login successful");
    return { ok: result.ok, message: result.message };
  }

  @Patch("/:email")
  updateUser(@Param("email") userEmail: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(userEmail, updateUserDto);
  }

}
