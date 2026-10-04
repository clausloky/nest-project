import { Module } from '@nestjs/common';
import { RegionsService } from './regions.service.js';
import { RegionsController } from './regions.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from './entities/region.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Region])],
  controllers: [RegionsController],
  providers: [RegionsService, AuthGuard, RolesGuard],
})
export class RegionsModule {}
