import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { AuditableEntity } from 'src/config/auditable-entity.config';
import { Permiso } from 'src/mroles-permisos/permisos/entities/permiso.entity';
import { PersonaRol } from 'src/mroles-permisos/personas_roles/entities/persona_rol.entity';
import { AccionPermiso } from 'src/mroles-permisos/utils/roles-permisos.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'persona_permisos_personalizado' })
@ObjectType()
export class PersonaPermisoPersonalizado extends AuditableEntity {
  @IsUUID('4', { message: 'Invalid UUID format' })
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @IsEnum(AccionPermiso)
  @Column({ type: 'enum', enum: AccionPermiso })
  @Field()
  accion: AccionPermiso;

  @IsUUID('4', { message: 'Invalid UUID format' })
  @Column()
  @Field(() => String)
  permiso_id: string;

  @IsUUID('4', { message: 'Invalid UUID format' })
  @Column()
  @Field(() => String)
  persona_rol_id: string;

  @Field(() => Permiso)
  @ManyToOne(() => Permiso, (permiso) => permiso.persona_permiso_personalizado)
  @JoinColumn({ name: 'permiso_id' })
  permiso: Permiso;

  @Field(() => PersonaRol)
  @ManyToOne(
    () => PersonaRol,
    (persona_rol) => persona_rol.persona_permiso_personalizado,
  )
  @JoinColumn({ name: 'persona_rol_id' })
  persona_rol: PersonaRol;
}
