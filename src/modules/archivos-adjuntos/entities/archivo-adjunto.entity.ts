import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { TipoAdjuntoEnum } from 'src/common/enums/archivo.enum';
import { TablasEntidades } from 'src/common/enums/entidades.enum';
import { AuditableEntity } from 'src/config/auditable-entity.config';
import { Archivo } from 'src/modules/archivos/entities/archivo.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('archivos_adjuntos')
export class ArchivoAdjunto extends AuditableEntity {
  @IsUUID()
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({
    name: 'nombre_tabla',
    type: 'enum',
    enum: TablasEntidades,
    nullable: false,
  })
  nombre_tabla: TablasEntidades;

  @Field({ nullable: true })
  @Column({ name: 'registro_id' })
  registro_id: string;

  @Field({ nullable: true })
  @Column({
    name: 'tipo_adjunto',
    type: 'enum',
    enum: TipoAdjuntoEnum,
    nullable: true,
    default: TipoAdjuntoEnum.DEFAULT,
  })
  tipo_adjunto: TipoAdjuntoEnum;

  @Field({ nullable: true })
  @Column({ name: 'archivo_id' })
  archivo_id: string;

  @Field(() => Archivo)
  @ManyToOne((type) => Archivo, (archivo) => archivo.archivos_adjuntos)
  @JoinColumn({ name: 'archivo_id' })
  archivo: Promise<Archivo>;
}
