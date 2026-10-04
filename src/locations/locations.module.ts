import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service.js';
import { LocationsController } from './locations.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Location])],
  controllers: [LocationsController],
  providers: [LocationsService, AuthGuard, RolesGuard],
})
export class LocationsModule {}
