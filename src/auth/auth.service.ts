import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { Employee } from '../employees/entities/employee.entity.js';
import { Manager } from '../managers/entities/manager.entity.js';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto.js';

const saltRounds = 5;

@Injectable()
export class AuthService {
  constructor(
  @InjectRepository(User)
  private userRepository: Repository<User>,

  @InjectRepository(Employee)
  private employeeRepository: Repository<Employee>,

  @InjectRepository(Manager)
  private managerRepository: Repository<Manager>,

  private jwtService: JwtService,
) {}

  async registerEmployee(
    id: string,
    createUserDto: CreateUserDto,
  ) {
    createUserDto.userRoles = ["Employee"];
    createUserDto.userPassword = bcrypt.hashSync(
      createUserDto.userPassword,
      5,
    );

    const user = await this.userRepository.save(createUserDto);

    const employeeToUpdate = await this.employeeRepository.preload({
      employeeId: id,
    });

    if (!employeeToUpdate) {
      throw new NotFoundException('Employee not found');
    }

    employeeToUpdate.user = user;

    return this.employeeRepository.save(employeeToUpdate);
  }

  async registerManager(
    id: string,
    createUserDto: CreateUserDto,
  ) {
    createUserDto.userRoles = ["Manager"];
    createUserDto.userPassword = bcrypt.hashSync(
      createUserDto.userPassword,
      5,
    );

    const user = await this.userRepository.save(
      createUserDto,
    );

    const manager = await this.managerRepository.preload({
      managerId: id,
    });

    if (!manager) {
      throw new NotFoundException('Manager not found');
    }

    manager.user = user;

    return this.managerRepository.save(
      manager,
    );
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        userEmail: loginUserDto.userEmail
      }
    });

    if (!user) throw new UnauthorizedException("No se encontro el usuario.");

    const match = await bcrypt.compare(loginUserDto.userPassword, user.userPassword);

    if (!match) throw new UnauthorizedException("No esta autorizado.");


    const payload = {
      sub: user.userId,
      username: user.userEmail,
      roles: user.userRoles.map((role) => role.toLowerCase()),
      userRoles: user.userRoles,
    }
    const token = this.jwtService.sign(payload);

    return { ok: true, message: "Login con exito.", token };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.userPassword) {
      updateUserDto.userPassword = bcrypt.hashSync(
        updateUserDto.userPassword,
        5
      );
    }

    const newUserData = await this.userRepository.preload({
      userId: id,
      ...updateUserDto,
    });

    if (!newUserData) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.save(newUserData);

    return newUserData;
  }
}
