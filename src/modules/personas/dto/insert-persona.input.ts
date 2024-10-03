import { InputType, Int, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';

@InputType()
export class InsertPersonaInput {
  @IsString()
  @Field(() => String, { nullable: true })
  nombres: string;

  @IsString()
  @Field(() => String, { nullable: true })
  apellidos: string;

  @IsDate()
  @Field({ nullable: true })
  fecha_nacimiento: Date;

  @IsString()
  @Field(() => String, { nullable: true })
  email: string;

  @IsString()
  @Field(() => String, { nullable: true })
  telefono: string;

  @IsString()
  @Field(() => String, { nullable: true })
  codigo_region: string;

  @IsNumber()
  @Field(() => Number, { nullable: true })
  pais_id: number;

  @IsString()
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

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).*$/, {
    message:
      'La contraseña debe tener al menos 6 caracteres, 1 número, 1 letra mayúscula y 1 carácter especial.',
  })
  password?: string;

  //oauth
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  foto_perfil_google?: string;

  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  email_verificado?: boolean;
}
