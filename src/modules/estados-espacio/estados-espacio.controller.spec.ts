import { Test, TestingModule } from '@nestjs/testing';
import { EstadosEspacioController } from './estados-espacio.controller.js';

describe('EstadosEspacioController', () => {
  let controller: EstadosEspacioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadosEspacioController],
    }).compile();

    controller = module.get<EstadosEspacioController>(EstadosEspacioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
