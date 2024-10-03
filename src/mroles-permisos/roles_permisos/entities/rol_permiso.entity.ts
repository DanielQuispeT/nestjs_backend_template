import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { AuditableEntity } from 'src/config/auditable-entity.config';
import { Permiso } from 'src/mroles-permisos/permisos/entities/permiso.entity';
import { Rol } from 'src/mroles-permisos/roles/entities/rol.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'roles_permisos' })
export class RolPermiso extends AuditableEntity {
  @IsUUID()
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  rol_id: string;

  @Field(() => String)
  @Column()
  permiso_id: string;

  @Field(() => Rol)
  @ManyToOne(() => Rol, (rol) => rol.permisos_rol, { eager: true })
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @Field(() => Permiso)
  @ManyToOne(() => Permiso, (permiso) => permiso.roles_permiso, { eager: true })
  @JoinColumn({ name: 'permiso_id' })
  permiso: Permiso;
}
