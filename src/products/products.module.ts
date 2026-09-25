import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';

import { Product } from './entities/product.entity.js';
import { Provider } from '../providers/entities/provider.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Provider,
    ]),
  ],

  controllers: [ProductsController],

  providers: [ProductsService],
})
export class ProductsModule {}