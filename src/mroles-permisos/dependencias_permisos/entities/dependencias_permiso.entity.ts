import { ObjectType, Field } from '@nestjs/graphql';
import { AuditableEntity } from 'src/config/auditable-entity.config';
import { Permiso } from 'src/mroles-permisos/permisos/entities/permiso.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'dependencias_permisos' })
@ObjectType()
export class DependenciaPermiso extends AuditableEntity {
  @PrimaryColumn('uuid')
  @Field(() => String)
  permiso_id: string;

  @PrimaryColumn('uuid')
  @Field(() => String)
  permiso_id_necesario: string;

  @ManyToOne(() => Permiso, (permiso) => permiso.dependencias_permiso)
  @JoinColumn({ name: 'permiso_id' })
  @Field(() => Permiso)
  permiso: Permiso;

  @ManyToOne(() => Permiso)
  @JoinColumn({ name: 'permiso_id_necesario' })
  @Field(() => Permiso)
  permiso_necesario: Permiso;
}
