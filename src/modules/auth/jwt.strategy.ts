import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
  
      secretOrKey: process.env.JWT_SECRET || 'LoginParqueo_2026_JVC_KEY', 
    });
  }

  async validate(payload: any) {
    // Aquí validas la estructura del payload que envía la API de tu amigo
    if (!payload.sub) {
      throw new UnauthorizedException('Token inválido '); 
    }
    
    // Si necesitas validar roles, aquí es el lugar
    //if (payload.rol !== 'ADMIN') throw new ForbiddenException();

    // Este retorno se inyectará en la request (req.user)
    return { userId: payload.sub, email: payload.email, rol: payload.rol };
  }
}