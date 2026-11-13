import { BadRequestException, Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ParseUUIDPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EmployeesService } from './employees.service.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { ROLES } from '../auth/constants/roles.constants.js';
import { ApiAuth } from '../auth/decorators/api.decorator.js';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AwsService } from '../aws/aws.service.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';

@ApiTags("Employees")
@ApiAuth()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService, private readonly awsService: AwsService) {}

  @Auth(ROLES.MANAGER)
  @Post()
  @UseInterceptors(FileInterceptor("employeePhoto"))
  async create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createEmployeeDto.employeePhotoUrl = await this.awsService.uploadFile(file);
    }

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
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  async uploadPhoto(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Photo file is required');
    }

    const photoUrl = await this.awsService.uploadFile(file);
    const employee = await this.employeesService.update(id, {
      employeePhotoUrl: photoUrl,
    });

    return { photoUrl: employee.employeePhotoUrl };
  }

  @Auth(ROLES.MANAGER)
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string
  ) {
    return this.employeesService.findOne(id);
  }

  @Auth(ROLES.MANAGER)
  @UseInterceptors(FileInterceptor("employeePhoto"))
  @Patch("/:id")
  async update(
    @Param("id", new ParseUUIDPipe({ version: "4" })) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @UploadedFile() file: Express.Multer.File | undefined,
  ) {
    if (file) {
      updateEmployeeDto.employeePhotoUrl = await this.awsService.uploadFile(file);
    }

    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({version: '4'})) id: string) {
    return this.employeesService.remove(id);
  }
}
