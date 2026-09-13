import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { version } from 'os';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get('/test')
  getFibonacci() {
    return this.employeesService.getFibonnaci();
  }

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
