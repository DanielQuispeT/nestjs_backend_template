import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  IsDate,
  IsNumber,
  IsString,
  IsUUID,
  Matches,
  IsOptional,
  IsInt,
  IsEmail,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AuditableEntity } from 'src/config/auditable-entity.config';
import { Credencial } from 'src/modules/credenciales/entities/credencial.entity';
import { Pais } from 'src/modules/paises/entities/pais.entity';
import { PersonaRol } from 'src/mroles-permisos/personas_roles/entities/persona_rol.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'personas' })
export class Persona extends AuditableEntity {
  @IsUUID('4', { message: 'Invalid UUID format' })
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 50 })
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El nombre debe tener menos de 50 caracteres' })
  @Field(() => String, { nullable: true })
  nombres: string;

  @Column({ type: 'varchar', length: 50 })
  @IsString({ message: 'El apellido debe ser un texto' })
  @MinLength(2, { message: 'El apellido debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El apellido debe tener menos de 50 caracteres' })
  @Field(() => String, { nullable: true })
  apellidos: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
    transformer: {
      to: (value: Date | null) => {
        const fechaUTC = value ? value.toISOString() : null;
        return fechaUTC; // Antes de guardar en la DB
      }, // Antes de guardar en la DB
      from: (value: any) => {
        if (value) {
          return value;
        } else {
          return null;
        }
      },
    },
  })
  @IsDate({ message: 'La fecha de nacimiento debe ser una fecha' })
  @Field(() => Date, { nullable: true })
  fecha_nacimiento: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  @IsString({ message: 'La foto de perfil debe ser un texto' })
  @IsOptional({ message: 'La foto de perfil es opcional' })
  @Field(() => String, { nullable: true })
  foto_perfil: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  @IsString({ message: 'La foto de perfil de google debe ser un texto' })
  @IsOptional({ message: 'La foto de perfil de google es opcional' })
  @Field(() => String, { nullable: true })
  foto_perfil_google: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
    unique: true,
  })
  @IsString({ message: 'El email debe ser un texto' })
  @IsEmail({}, { message: 'El email debe ser un email válido' })
  @MaxLength(100, { message: 'El email debe tener menos de 100 caracteres' })
  @Field(() => String, { nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  @IsString({ message: 'El código de verificación debe ser un texto' })
  @IsOptional({ message: 'El código de verificación es opcional' })
  @Field(() => String, { nullable: true })
  codigo_verificacion: string;

  @Column({ type: 'boolean', default: false })
  @IsOptional({ message: 'El email verificado es opcional' })
  @Field(() => Boolean, { nullable: true })
  email_verificado: boolean;

  @Column({ type: 'varchar', length: 20, default: null })
  @IsInt({ message: 'El teléfono debe ser un número' })
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres' })
  @MaxLength(20, { message: 'El teléfono debe tener menos de 20 caracteres' })
  @Field(() => String, { nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 10, nullable: true, default: null })
  @Matches(/^\+\d{1,3}$/, { message: 'Código inválido' })
  @MinLength(2, {
    message: 'El código de región debe tener al menos 2 caracteres',
  })
  @MaxLength(6, {
    message: 'El código de región debe tener menos de 6 caracteres',
  })
  @IsString({ message: 'El código de región debe ser un texto' })
  @Field(() => String, { nullable: true })
  codigo_region: string;

  @Column({ type: 'varchar', length: 50, nullable: true, default: null })
  @IsString({ message: 'La ciudad debe ser un texto' })
  @MinLength(2, { message: 'La ciudad debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'La ciudad debe tener menos de 50 caracteres' })
  @Field(() => String, { nullable: true })
  ciudad: string;

  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(1000, {
    message: 'La biografía debe tener menos de 1000 caracteres',
  })
  @Field(() => String, { nullable: true })
  biografia: string;

  @IsString()
  @Field(() => String, { nullable: true })
  @MaxLength(100, {
    message: 'La URL de linkedin debe tener menos de 100 caracteres',
  })
  @Column({ type: 'varchar', length: 100, nullable: true, default: null })
  url_linkedin: string;

  @IsString()
  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true, default: null })
  @MaxLength(100, {
    message: 'La URL de facebook debe tener menos de 100 caracteres',
  })
  url_facebook: string;

  @IsString()
  @Field(() => String, { nullable: true })
  @MaxLength(100, {
    message: 'La URL de instagram debe tener menos de 100 caracteres',
  })
  @Column({ type: 'varchar', length: 100, nullable: true, default: null })
  url_instagram: string;

  @Field(() => Credencial)
  @OneToOne(() => Credencial, (credencial) => credencial.persona)
  credencial: Credencial;

  @Field(() => [PersonaRol], { nullable: true })
  @OneToMany(() => PersonaRol, (persona_rol) => persona_rol.persona)
  persona_roles: PersonaRol[];

  //Pais
  @ManyToOne(() => Pais, (pais) => pais.personas, { nullable: true })
  @Field(() => Pais, { nullable: true })
  @JoinColumn({ name: 'pais_id' })
  pais: Pais;

  @Field({ nullable: true })
  @Column({ name: 'pais_id', nullable: true })
  pais_id: number;
}
