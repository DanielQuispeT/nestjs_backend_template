import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class InsertRolInput {
  @IsString()
  @Field(() => String, { description: 'Nombre del rol' })
  nombre: string;

  @IsString()
  @Field(() => String, { description: 'Descripción del rol' })
  descripcion: string;
}
