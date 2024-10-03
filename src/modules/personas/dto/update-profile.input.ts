import { IsDate, IsInt, IsNumber, IsString } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateProfileInput {
  @IsString()
  @Field(() => String, { nullable: true })
  nombres: string;

  @IsString()
  @Field(() => String, { nullable: true })
  apellidos: string;

  @IsDate()
  @Field( { nullable: true })
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

  @IsString()
  @Field(() => String, { nullable: true })
  foto_perfil: string;

  @IsString()
  @Field(() => String, { nullable: true })
  foto_perfil_id: string;
}
