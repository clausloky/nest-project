import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const saltRounds = 5;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
) {}

  registerUser(createUserDTo: CreateUserDto) {
    createUserDTo.userPassword = bcrypt.hashSync(createUserDTo.userPassword, saltRounds)
    return this.userRepository.save(createUserDTo);
  }

  async loginUser(createUserDTO: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        userEmail: createUserDTO.userEmail
      }
    });

    const match = bcrypt.compare(createUserDTO.userPassword, createUserDTO.userPassword);
    if (!match) throw new UnauthorizedException("No esta autorizado.");

    const token = jwt.sign(JSON.stringify(user), "SECRET");

    return {ok: true, message: "Login con exito."} // Preferi hacerlo asi por que en mi server express lo solia hacer asi
  }
}
