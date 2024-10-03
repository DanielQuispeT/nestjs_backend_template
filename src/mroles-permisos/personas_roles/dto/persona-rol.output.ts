import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsDate, IsInt, IsString, IsUUID } from 'class-validator';
import { PersonaRol } from '../entities/persona_rol.entity';
import { Pais } from 'src/modules/paises/entities/pais.entity';

@ObjectType()
export class PersonaConRol {
  @Field(() => Date)
  @IsDate()
  created_at: Date;

  @Field(() => Date)
  @IsDate()
  updated_at: Date;

  @IsUUID('4', { message: 'Invalid UUID format' })
  @Field(() => String)
  id: string;

  @IsString({ message: 'El nombre debe ser un texto' })
  @Field(() => String, { nullable: true })
  nombres: string;

  @IsString({ message: 'El apellido debe ser un texto' })
  @Field(() => String, { nullable: true })
  apellidos: string;

  @IsDate({ message: 'La fecha de nacimiento debe ser una fecha' })
  @Field({ nullable: true })
  fecha_nacimiento: Date;

  @IsString({ message: 'La foto de perfil debe ser un texto' })
  @Field(() => String, { nullable: true })
  foto_perfil: string;

  @IsString({ message: 'La foto de perfil de google debe ser un texto' })
  @Field(() => String, { nullable: true })
  foto_perfil_google: string;

  @IsString({ message: 'El email debe ser un texto' })
  @Field(() => String, { nullable: true })
  email: string;

  @IsString({ message: 'El código de verificación debe ser un texto' })
  @Field(() => String, { nullable: true })
  codigo_verificacion: string;

  @IsBoolean({ message: 'El email verificado debe ser un booleano' })
  @Field(() => Boolean, { nullable: true })
  email_verificado: boolean;

  @IsString()
  @Field(() => String, { nullable: true })
  telefono: string;

  @IsString({ message: 'El código de región debe ser un texto' })
  @Field(() => String, { nullable: true })
  codigo_region: string;

  @IsString({ message: 'La ciudad debe ser un texto' })
  @Field(() => String, { nullable: true })
  ciudad: string;

  @IsString()
  @Field(() => String, { nullable: true })
  biografia: string;

  @IsString()
  @Field(() => String, { nullable: true })
  url_linkedin: string;

  @IsString()
  @Field(() => String, { nullable: true })
  url_facebook: string;

  @IsString()
  @Field(() => String, { nullable: true })
  url_instagram: string;

  @Field(() => PersonaRol)
  persona_roles: PersonaRol;

  @Field(() => Pais, { nullable: true })
  pais: Pais;
}
