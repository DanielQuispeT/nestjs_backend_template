import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditoriaRegistro } from './entities/auditoria_registro.entity';
import { AuditoriaInput } from './dto/auditoria.input';

@Injectable()
export class AuditoriaRegistrosService {
  constructor(
    @InjectRepository(AuditoriaRegistro)
    private auditoriaRegistroRepository: Repository<AuditoriaRegistro>,
  ) {}
  async insert(input: AuditoriaInput): Promise<AuditoriaRegistro> {
    try {
      const registro = this.auditoriaRegistroRepository.create(input);
      return await this.auditoriaRegistroRepository.save(registro);
    } catch (error) {
      throw error;
    }
  }
}
