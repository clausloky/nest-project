import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';

import { Product } from './entities/product.entity.js';
import { Provider } from '../providers/entities/provider.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Product,
      Provider,
    ]),
  ],

  controllers: [ProductsController],

  providers: [ProductsService, AuthGuard, RolesGuard],
})
export class ProductsModule {}