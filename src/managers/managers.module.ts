import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service.js';
import { ManagersController } from './managers.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manager } from './entities/manager.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Manager])],
  controllers: [ManagersController],
  providers: [ManagersService, AuthGuard, RolesGuard],
})
export class ManagersModule {}
