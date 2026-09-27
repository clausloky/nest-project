import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    this.authService = authService; // Solo comparo mi codigo con el de C++ que tambien tiene clases
  }

  @Post()
  signUp(@Body() createUserDTo: CreateUserDto) {
    this.authService.registerUser(createUserDTo);
  }

}
