import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'SECRET',
      signOptions: { expiresIn: '1h' }, // Los tokens expiran en 1 hora
      global: true, // hace que el servicio JWT esté disponible en toda la app
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
