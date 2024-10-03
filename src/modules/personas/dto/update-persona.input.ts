import {
  IsDate,
  IsInt,
  IsNumber,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { InsertPersonaInput } from './insert-persona.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePersonaInput extends PartialType(InsertPersonaInput) {
  @IsString()
  @Field(() => String, { nullable: true })
  id: string;

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
}
