import { ObjectType, Field } from '@nestjs/graphql';
import { IsUUID, IsNotEmpty } from 'class-validator';
import { AuditableEntity } from 'src/config/auditable-entity.config';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Persona } from 'src/modules/personas/entities/persona.entity';

@Entity({ name: 'credenciales' })
@Unique(['persona'])
@ObjectType()
export class Credencial extends AuditableEntity {
  @IsUUID('4', { message: 'Formato inválido' })
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id: string;

  @Column({ default: null })
  @Field({ nullable: true })
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  password?: string;

  @OneToOne(() => Persona, (people) => people.credencial, { eager: true })
  @JoinColumn({ name: 'persona_id' })
  persona: Persona;

  @RelationId((credencial: Credencial) => credencial.persona)
  persona_id: string;

  @Column({ default: null })
  @Field({ nullable: true })
  refreshToken?: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
