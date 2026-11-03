import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Autenticación (Proxy SOA)')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Inicia sesión validando ' })
  @ApiResponse({ status: 200, description: 'Bienvenido.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.loginProxy(loginDto);
  }

  @Post('registro')
  @ApiOperation({ summary: 'Registra un usuario' })
  async registro(@Body() datos: any) {
    return this.authService.registroProxy(datos);
  }
}