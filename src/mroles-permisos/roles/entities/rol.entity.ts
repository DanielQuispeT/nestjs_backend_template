import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { AuditableEntity } from 'src/config/auditable-entity.config';
import { PersonaRol } from 'src/mroles-permisos/personas_roles/entities/persona_rol.entity';
import { RolPermiso } from 'src/mroles-permisos/roles_permisos/entities/rol_permiso.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'roles' })
export class Rol extends AuditableEntity {
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
  nombre: string;

  @Field(() => String)
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  descripcion: string;

  @Field(() => [PersonaRol])
  @OneToMany(() => PersonaRol, (persona_rol) => persona_rol.rol)
  personas_rol: PersonaRol[];

  @Field(() => [RolPermiso])
  @OneToMany(() => RolPermiso, (rol_permiso) => rol_permiso.rol)
  permisos_rol: RolPermiso[];
}
