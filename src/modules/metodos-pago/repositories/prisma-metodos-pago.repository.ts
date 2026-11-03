import { Injectable } from '@nestjs/common';
import { IMetodosPagoRepository } from './metodos-pago.repository.interface.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { MetodoPago } from '@prisma/client';

export class PrismaMetodosPagoRepository implements IMetodosPagoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: any): Promise<MetodoPago> {
    return this.prisma.metodoPago.create({ data: datos });
  }

  async buscarPorNombre(nombre: string): Promise<MetodoPago | null> {
    return this.prisma.metodoPago.findFirst({ where: { nombre } });
  }

  async buscarPorId(id: number): Promise<MetodoPago | null> {
    return this.prisma.metodoPago.findUnique({ where: { id } });
  }

  async obtenerTodos(): Promise<MetodoPago[]> {
    return this.prisma.metodoPago.findMany();
  }
}