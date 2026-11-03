import { Test, TestingModule } from '@nestjs/testing';
import { NivelesParqueoController } from './niveles-parqueo.controller.js';

describe('NivelesParqueoController', () => {
  let controller: NivelesParqueoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NivelesParqueoController],
    }).compile();

    controller = module.get<NivelesParqueoController>(NivelesParqueoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
