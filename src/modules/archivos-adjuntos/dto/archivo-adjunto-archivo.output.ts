import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { ArchivoAdjunto } from '../entities/archivo-adjunto.entity';
import { Archivo } from 'src/modules/archivos/entities/archivo.entity';

@ObjectType()
export class ArchivoAdjuntoConArchivo {
  @Field()
  archivo_adjunto: ArchivoAdjunto;

  @Field()
  archivo: Archivo;
}
