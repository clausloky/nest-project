import { Controller, Get, Post, Patch, Delete, Param, Body, NotFoundException, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ProvidersService } from './providers.service.js';
import { CreateProviderDto } from './dto/create-provider.dto.js';
import { UpdateProviderDto } from './dto/update-provider.dto.js';
import { UserData } from '../auth/decorators/user.decorator.js';
import { User } from '../auth/entities/user.entity.js';
import { Auth } from '../auth/decorators/auth.decorator.js';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providersService.create(createProviderDto);
  }

  @Auth(["Admin"])
  @Get()
  findAll(@UserData() user: User) {
    if (user.userRoles?.includes("Employee")) throw new UnauthorizedException("No autorizado, solo admins.");
    console.log(user);
    return this.providersService.findAll();
  }

  // 🔎 Nuevo endpoint: buscar por nombre
  @Get('name/:name')
  async findByName(@Param('name') name: string) {
    const provider = await this.providersService.findByName(name);
    if (!provider) throw new NotFoundException(`Provider with name ${name} not found`);
    return provider;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const provider = await this.providersService.findOne(id);
    if (!provider) throw new NotFoundException(`Provider with id ${id} not found`);
    return provider;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProviderDto: UpdateProviderDto) {
    return this.providersService.update(id, updateProviderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.providersService.remove(id);
  }
}
