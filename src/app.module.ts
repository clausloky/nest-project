import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EmployeesModule } from './employees/employees.module.js';
import { ProductsModule } from './products/products.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from "@nestjs/config";
import { ProvidersModule } from './providers/providers.module.js';
import { LocationsModule } from './locations/locations.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      username: 'postgres',
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      autoLoadEntities: true,
      synchronize: true,
    }),

    EmployeesModule,
    ProductsModule,
    ProvidersModule,
    LocationsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
