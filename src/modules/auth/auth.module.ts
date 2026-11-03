import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { JwtStrategy } from './jwt.strategy.js';

@Module({
  imports: [HttpModule], 
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
