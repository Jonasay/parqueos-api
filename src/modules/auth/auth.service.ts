import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {

  private readonly EXTERNAL_API_URL = process.env.EXTERNAL_API_URL; 

  constructor(private readonly httpService: HttpService) {}

  async loginProxy(credenciales: LoginDto) {
    try {

      const respuesta = await lastValueFrom(
        this.httpService.post(`${this.EXTERNAL_API_URL}/login`, credenciales)
      );
      
    
      return respuesta.data; 
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new UnauthorizedException('Credenciales inválidas.');
      }
      throw new InternalServerErrorException('Error de comunicación con el servicio externo de autenticación.');
    }
  }

  async registroProxy(datos: any) {
    try {
      const respuesta = await lastValueFrom(
        this.httpService.post(`${this.EXTERNAL_API_URL}/registro`, datos)
      );
      return respuesta.data;
    } catch (error) {
      throw new InternalServerErrorException('Fallo al registrar usuario en el servicio externo.');
    }
  }
}