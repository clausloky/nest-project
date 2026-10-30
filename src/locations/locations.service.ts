import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto.js';
import { UpdateLocationDto } from './dto/update-location.dto.js';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Manager } from '../managers/entities/manager.entity.js';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Manager)
    private readonly managerRepository: Repository<Manager>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const location = this.locationRepository.create(createLocationDto);
    return await this.locationRepository.save(location);
  }

  async findAll(): Promise<Location[]> {
    return await this.locationRepository.find();
  }

  async findOne(id: number): Promise<Location> {
    const location = await this.locationRepository.findOneBy({ locationId: id });
    if (!location) throw new NotFoundException('Location not found');
    return location;
  }

  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    // Eliminar la relación actual manager -> location
    await this.managerRepository
      .createQueryBuilder()
      .update()
      .set({ location: null })
      .where("locationId = :id", { id })
      .execute();

    // Actualizar la ubicación
    const location = await this.locationRepository.preload({
      locationId: id,
      ...updateLocationDto,
    });

    if (!location) {
      throw new NotFoundException("Location not found");
    }

    const savedLocation = await this.locationRepository.save(location);

    // Asignar el nuevo manager si se envió uno
    if (updateLocationDto.manager) {
      const updatedManager = await this.managerRepository.preload({
        managerId: updateLocationDto.manager,
        location: savedLocation,
      });

      if (!updatedManager) {
        throw new NotFoundException("Manager not found");
      }

      await this.managerRepository.save(updatedManager);
    }

    return savedLocation;
  }

  async remove(id: number): Promise<void> {
    const result = await this.locationRepository.delete({ locationId: id });
    if (result.affected === 0) throw new NotFoundException('Location not found');
  }
}
