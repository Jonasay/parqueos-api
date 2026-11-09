import { Test, TestingModule } from '@nestjs/testing';
import { PagosController } from './pagos.controller.js';
import { PagosService } from './pagos.service.js';

describe('PagosController', () => {
  let controller: PagosController;
  const pagosService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagosController],
      providers: [{ provide: PagosService, useValue: pagosService }],
    }).compile();

    controller = module.get<PagosController>(PagosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
