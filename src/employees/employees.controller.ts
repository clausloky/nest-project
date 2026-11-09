import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ParseUUIDPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EmployeesService } from './employees.service.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { ROLES } from '../auth/constants/roles.constants.js';
import { ApiAuth } from '../auth/decorators/api.decorator.js';
import { ApiTags } from '@nestjs/swagger';
import { AwsService } from '../aws/aws.service.js';
import { FILE } from 'dns';

@ApiTags("Employees")
@ApiAuth()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService, private readonly awsService: AwsService) {}

  @Auth(ROLES.MANAGER)
  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Auth(ROLES.MANAGER)
  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Auth(ROLES.MANAGER)
  @Get('location/:locationId')
  findByLocation(
    @Param('locationId', ParseIntPipe) locationId: number,
  ) {
    return this.employeesService.findByLocation(locationId);
  }

  @Auth(ROLES.MANAGER, ROLES.EMPLOYEE)
  @Post(":id/upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const response = await this.awsService.uploadFile(file)

    return this.employeesService.update(id, {
      employeePhoto: response,
    })
  }

  @Auth(ROLES.MANAGER)
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id') // Preferi utilizar un nuevo data, para reemplazar completamente el anterior
  update(@Param('id', new ParseUUIDPipe({version: '4'})) id: string, @Body() CreateEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.update(id, CreateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.employeesService.remove(id);
  }
}
