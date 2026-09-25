import { PartialType } from '@nestjs/mapped-types';

import { CreateProductDto } from './create-product.dto.js';

import { IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {

  @IsOptional()
  productName?: string;

  @IsOptional()
  price?: number;

  @IsOptional()
  countSeal?: number;

  @IsOptional()
  providerId?: string;

}