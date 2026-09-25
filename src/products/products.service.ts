import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { Product } from './entities/product.entity.js';
import { Provider } from '../providers/entities/provider.entity.js';

import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async create(createProductDto: CreateProductDto) {

    const product = this.productRepository.create({
      productId: uuid(),
      productName: createProductDto.productName,
      price: createProductDto.price,
      countSeal: createProductDto.countSeal
    });

    return await this.productRepository.save(product);
  }

  async findAll() {
    return await this.productRepository.find({
      relations: {
        provider: true,
      },
    });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { productId: id },
      relations: {
        provider: true,
      },
    });

    if (!product) throw new NotFoundException();

    return product;
  }

  async findByProvider(id: string) {
    const products = await this.productRepository.find({
      where: {
        provider: {
          providerId: id,
        },
      },
      relations: {
        provider: true,
      },
    });

    if (products.length === 0) throw new NotFoundException();

    return products;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (updateProductDto.provider) {
      // const provider = await this.providerRepository.findOneBy({
      //   provider: updateProductDto.provider,
      // });

      // if (!provider) throw new NotFoundException('Provider not found');

      // product.provider = provider;
    }

    Object.assign(product, {
      productName: updateProductDto.productName ?? product.productName,
      price: updateProductDto.price ?? product.price,
      countSeal: updateProductDto.countSeal ?? product.countSeal,
    });

    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.productRepository.delete({
      productId: id,
    });

    return {
      message: `Objeto con id ${id} eliminado`,
    };
  }
}