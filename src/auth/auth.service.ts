import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto.js';

const saltRounds = 5;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService
) {}

  registerUser(createUserDTo: CreateUserDto) {
    createUserDTo.userPassword = bcrypt.hashSync(createUserDTo.userPassword, saltRounds)
    return this.userRepository.save(createUserDTo);
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        userEmail: loginUserDto.userEmail
      }
    });

    if (!user) throw new NotFoundException("No se encontro el usuario.");

    const match = await bcrypt.compare(loginUserDto.userPassword, user.userPassword);

    console.log(user, loginUserDto);

    if (!match) throw new UnauthorizedException("No esta autorizado.");
    const payload = {
      userEmail: user?.userEmail,
      userPassword: user?.userPassword,
      userRoles: user?.userRoles
    }
    const token = this.jwtService.sign(payload);

    return {ok: true, message: "Login con exito.", token} // Preferi hacerlo asi por que en mi server express lo solia hacer asi
  }

  async updateUser(userEmail: string, updateUserDto: UpdateUserDto) {
    const newUserData = await this.userRepository.preload({
      userEmail: userEmail,
      ...updateUserDto
    });

    if (!newUserData) throw new NotFoundException("No se encontro el usuario");

    this.userRepository.save(newUserData);
    return newUserData;
  }
}
