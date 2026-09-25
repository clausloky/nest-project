import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProviderDto } from './dto/create-provider.dto.js';
import { UpdateProviderDto } from './dto/update-provider.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async create(createProviderDto: CreateProviderDto) {
    const provider = this.providerRepository.create(createProviderDto);
    return await this.providerRepository.save(provider);
  }

  async findAll() {
    return this.providerRepository.find();
  }

  async findByName(name: string) {
    return this.providerRepository.findOneBy({providerName: name});
  }

  async findOne(id: string) {
    return this.providerRepository.findOneBy({ providerId: id });
  }

  async update(id: string, updateProviderDto: UpdateProviderDto) {
    const provider = await this.providerRepository.preload({
      providerId: id,
      ...updateProviderDto,
    });

    if (!provider) throw new NotFoundException(`Provider with id ${id} not found`);

    return this.providerRepository.save(provider);
  }

  async remove(id: string) {
    await this.providerRepository.delete({ providerId: id });
    return { message: `Provider with id ${id} eliminado` };
  }
}
