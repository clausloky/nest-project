import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity.js';
import { CreateRegionDto } from './dto/create-region.dto.js';
import { UpdateRegionDto } from './dto/update-region.dto.js';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {}

  async create(createRegionDto: CreateRegionDto): Promise<Region> {
    const region = this.regionRepository.create(createRegionDto);
    return await this.regionRepository.save(region);
  }

  async findAll(): Promise<Region[]> {
    return await this.regionRepository.find();
  }

  async findOne(id: number): Promise<Region> {
    const region = await this.regionRepository.findOneBy({ regionId: id });
    if (!region) throw new NotFoundException('Region not found');
    return region;
  }

  async update(id: number, updateRegionDto: UpdateRegionDto): Promise<Region> {
    const regionToUpdate = await this.regionRepository.preload({
      regionId: id,
      ...updateRegionDto,
    });
    if (!regionToUpdate) throw new BadRequestException('Region not found or invalid data');
    return await this.regionRepository.save(regionToUpdate);
  }

  async remove(id: number): Promise<void> {
    const result = await this.regionRepository.delete({ regionId: id });
    if (result.affected === 0) throw new NotFoundException('Region not found');
  }
}
