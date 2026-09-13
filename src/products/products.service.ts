import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create({
      ...createProductDto,
      productId: uuid(),
      provider: uuid(),
    });

    return await this.productRepository.save(product);
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ productId: id });
    if (!product) throw new NotFoundException();

    return product;
  }

  async findByProvider(id: string) {
    const products = await this.productRepository.find({ where: { provider: id } }); // Investigue sintaxis para que no fuera solo un findOneBy
    if (!products || products.length === 0) throw new NotFoundException();

    return products;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const productToUpdate = await this.productRepository.preload({
      productId: id,
      ...updateProductDto,
    });

    if (!productToUpdate) throw new NotFoundException();

    await this.productRepository.save(productToUpdate);

    return productToUpdate;
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.productRepository.delete({ productId: id });

    return { message: `Objeto con id ${id} eliminado` };
  }
}
