import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
import { AuditableEntity } from 'src/config/auditable-entity.config';
import { Persona } from 'src/modules/personas/entities/persona.entity';
import { PersonaPermisoPersonalizado } from 'src/mroles-permisos/persona_permisos_personalizado/entities/persona_permisos_personalizado.entity';
import { Rol } from 'src/mroles-permisos/roles/entities/rol.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'personas_roles' })
export class PersonaRol extends AuditableEntity {
  @IsUUID()
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Boolean)
  @Column({ default: false })
  personalizado: boolean;

  @IsString()
  @Field(() => String)
  @Column()
  persona_id: string;

  @IsString()
  @Field(() => String)
  @Column()
  rol_id: string;

  @Field(() => Persona)
  @ManyToOne(() => Persona, (persona) => persona.persona_roles, { eager: true })
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @Field(() => Rol)
  @ManyToOne(() => Rol, (rol) => rol.personas_rol, { eager: true })
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @OneToMany(
    () => PersonaPermisoPersonalizado,
    (persona_permiso_personalizado) =>
      persona_permiso_personalizado.persona_rol,
  )
  @Field(() => [PersonaPermisoPersonalizado], { nullable: true })
  persona_permiso_personalizado?: PersonaPermisoPersonalizado[];
}
