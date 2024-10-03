import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-type-json';
import { AuditableEntity } from 'src/config/auditable-entity.config';
import { DependenciaPermiso } from 'src/mroles-permisos/dependencias_permisos/entities/dependencias_permiso.entity';
import { PersonaPermisoPersonalizado } from 'src/mroles-permisos/persona_permisos_personalizado/entities/persona_permisos_personalizado.entity';
import { RolPermiso } from 'src/mroles-permisos/roles_permisos/entities/rol_permiso.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'permisos' })
export class Permiso extends AuditableEntity {
  @IsUUID()
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  codigo: string;

  @Field(() => String)
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
  })
  nombre: string;

  @Field(() => String)
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  descripcion: string;

  @Field(() => [RolPermiso])
  @OneToMany(() => RolPermiso, (rol_permiso) => rol_permiso.permiso)
  roles_permiso: RolPermiso[];

  @OneToMany(
    () => DependenciaPermiso,
    (dependenciasPermiso) => dependenciasPermiso.permiso,
    { eager: true },
  )
  @Field(() => [DependenciaPermiso], { nullable: true })
  dependencias_permiso?: DependenciaPermiso[];

  @OneToMany(
    () => PersonaPermisoPersonalizado,
    (persona_permiso_personalizado) => persona_permiso_personalizado.permiso,
  )
  @Field(() => [PersonaPermisoPersonalizado], { nullable: true })
  persona_permiso_personalizado?: PersonaPermisoPersonalizado[];
}

//para el enum de los permisos
@ObjectType()
export class PermisoEnum {
  @Field(() => GraphQLJSONObject)
  permisos: { [key: string]: string };
}
