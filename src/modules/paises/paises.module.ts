import { Module } from '@nestjs/common';
import { PaisesService } from './paises.service';
import { PaisesResolver } from './paises.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pais } from './entities/pais.entity';

@Module({
  providers: [PaisesResolver, PaisesService],
  imports: [TypeOrmModule.forFeature([Pais])],
  exports: [PaisesService],
})
export class PaisesModule {}
