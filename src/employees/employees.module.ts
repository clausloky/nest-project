import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service.js';
import { EmployeesController } from './employees.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity.js';
import { Location } from '../locations/entities/location.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { AwsModule } from '../aws/aws.module.js';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Employee, Location]), AwsModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, AuthGuard, RolesGuard],
})
export class EmployeesModule {}
