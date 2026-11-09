import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Autenticación (Proxy SOA)')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Valida credenciales externas y sincroniza una cuenta local' })
  @ApiResponse({ status: 200, description: 'Token local y usuario sincronizado.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.loginProxy(loginDto);
  }

  @Post('registro')
  @ApiOperation({ summary: 'Registra externamente y sincroniza al usuario local' })
  @ApiResponse({ status: 201, description: 'Registro sincronizado; no incluye un token.' })
  @ApiResponse({ status: 409, description: 'Correo o identidad en conflicto.' })
  async registro(@Body() datos: RegisterDto) {
    return this.authService.registroProxy(datos);
  }
}