import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { Employee } from './entities/employee.entity.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { Location } from '../locations/entities/location.entity.js';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    file?: Express.Multer.File,
  ) {
    const { location, ...employeeFields } = createEmployeeDto;
    const employee = this.employeeRepository.create({
      ...employeeFields,
      location: location === undefined ? null : { locationId: location },
      legacyLocation: null,
      employeePhotoUrl:
        createEmployeeDto.employeePhotoUrl ?? file?.filename ?? null,
    } as DeepPartial<Employee>);

    await this.employeeRepository.save(employee);

    return this.findOne(employee.employeeId);
  }

  async findAll() {
    const employees = await this.employeeRepository.find({
      relations: {
        location: true,
        user: true
      },
    });
    return this.resolveLocations(employees);
  }

  async findByLocation(locationId: number) {
    const employees = await this.employeeRepository.find({
      where: { location: { locationId } },
      relations: {
        location: true,
      },
    });
    return this.resolveLocations(employees);
  }

  async findOne(id: string) {
    const employee = await this.employeeRepository.findOne({
      where: {
        employeeId: id,
      },
      relations: {
        location: true,
        user: true
      },
    });

    if (!employee) return employee;
    return (await this.resolveLocations([employee]))[0];
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const { location, ...employeeFields } = updateEmployeeDto;
    const employeeToUpdate = await this.employeeRepository.preload({
      employeeId: id,
      ...employeeFields,
      ...(location !== undefined && {
        location: { locationId: location },
        legacyLocation: null,
      }),
    });
    if (!employeeToUpdate) throw new NotFoundException('Employee not found');
    await this.employeeRepository.save(employeeToUpdate);
    return employeeToUpdate;
  }

  private async resolveLocations(employees: Employee[]) {
    const legacyLocationIds = [
      ...new Set(
        employees
          .filter((employee) => !employee.location)
          .map((employee) => this.getLegacyLocationId(employee.legacyLocation))
          .filter((locationId): locationId is number => locationId !== undefined),
      ),
    ];
    const locations = legacyLocationIds.length
      ? await this.locationRepository.findBy({
          locationId: In(legacyLocationIds),
        })
      : [];
    const locationsById = new Map(
      locations.map((location) => [location.locationId, location]),
    );

    return employees.map((employee) => {
      const { legacyLocation: _legacyLocation, ...employeeData } = employee;
      const legacyLocationId = this.getLegacyLocationId(employee.legacyLocation);

      return {
        ...employeeData,
        location:
          employee.location ??
          (legacyLocationId === undefined
            ? null
            : locationsById.get(legacyLocationId) ?? null),
      };
    });
  }

  private getLegacyLocationId(
    legacyLocation: Employee["legacyLocation"],
  ): number | undefined {
    if (legacyLocation === null || legacyLocation === undefined) {
      return undefined;
    }

    const locationId =
      typeof legacyLocation === "object"
        ? legacyLocation.locationId
        : legacyLocation;
    const parsedLocationId = Number(locationId);

    return Number.isInteger(parsedLocationId) && parsedLocationId > 0
      ? parsedLocationId
      : undefined;
  }

  async remove(id: string) {
    const employee = await this.findOne(id);
    await this.employeeRepository.delete({ employeeId: id });
    return { message: 'Employee deleted', employee };
  }

  getFibonnaci() {
    const fibonacciNumbers: number[] = [];
    fibonacciNumbers.push(0, 1);

    const n: number = 10;
    for (let i: number = 2; i < n; i++) {
      fibonacciNumbers[i] = fibonacciNumbers[i - 1] + fibonacciNumbers[i - 2];
    }

    return fibonacciNumbers;
  }
}
