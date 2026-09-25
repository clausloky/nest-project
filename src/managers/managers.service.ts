import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto.js';
import { UpdateManagerDto } from './dto/update-manager.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Manager } from './entities/manager.entity.js';
import { Repository } from 'typeorm';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
  ) {}

  create(createManagerDto: CreateManagerDto) {
    return this.managerRepository.save(createManagerDto);
  }

  findAll() {
    return this.managerRepository.find();
  }

  async findOne(id: string) {
    const manager = await this.managerRepository.findOneBy({ managerId: id });
    if (!manager) throw new NotFoundException('Manager not found.');
    return manager;
  }

  async update(id: string, updateManagerDto: UpdateManagerDto): Promise<Manager> {
    const managerToUpdate = await this.managerRepository.preload({
      managerId: id,
      ...updateManagerDto,
    });
    if (!managerToUpdate) throw new BadRequestException('Manager not found or invalid data');
    return await this.managerRepository.save(managerToUpdate);
  }

  async remove(id: string): Promise<void> {
    const result = await this.managerRepository.delete({ managerId: id });
    if (result.affected === 0) throw new NotFoundException('Manager not found');
  }
}
