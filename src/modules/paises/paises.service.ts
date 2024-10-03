import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pais } from './entities/pais.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaisesService {
  constructor(
    @InjectRepository(Pais)
    private paisRepository: Repository<Pais>,
  ) {}

  async getAllPaises(): Promise<Pais[]> {
    return await this.paisRepository.find();
  }

  async getPais_ByName(name: string): Promise<Pais | null> {
    return await this.paisRepository.findOne({ where: { name } });
  }
  async getPais_ById(id: number): Promise<Pais | null> {
    return await this.paisRepository.findOne({ where: { id } });
  }
}
