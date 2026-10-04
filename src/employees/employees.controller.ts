import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EmployeesService } from './employees.service.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { ROLES } from '../auth/constants/roles.constants.js';
import { ApiAuth } from '../auth/decorators/api.decorator.js';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Employees")
@ApiAuth()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

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

  @Auth(ROLES.MANAGER, ROLES.EMPLOYEE)
  @Post("upload")
  @UseInterceptors(FileInterceptor("file" , {
    dest: "./src/employees/employees-photos"
  }))
  uploadPhoto(@UploadedFile() file: any) { // any por que mi multer no jala
    console.log(file);
    return 'OK';
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
