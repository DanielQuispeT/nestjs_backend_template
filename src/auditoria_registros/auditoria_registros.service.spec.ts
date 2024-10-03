import { Test, TestingModule } from '@nestjs/testing';
import { AuditoriaRegistrosService } from './auditoria_registros.service';

describe('AuditoriaRegistrosService', () => {
  let service: AuditoriaRegistrosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditoriaRegistrosService],
    }).compile();

    service = module.get<AuditoriaRegistrosService>(AuditoriaRegistrosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
