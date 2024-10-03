import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
import { AuditableEntity } from 'src/config/auditable-entity.config';
import { Persona } from 'src/modules/personas/entities/persona.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'paises' })
export class Pais extends AuditableEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  @IsString()
  dial_code: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 5, nullable: true, default: null })
  @IsString()
  code: string;

  @OneToMany(() => Persona, (persona) => persona.pais)
  personas: Persona[];
}
