import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto.js';
import { IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    /*
    All modifications must be optional
    */
    @IsOptional()
    productName: string;
    @IsOptional()
    price: number;
    @IsOptional()
    countSeal: number;
    @IsOptional()
    provider: string;
}
