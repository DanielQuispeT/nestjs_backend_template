import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateRolInput {
  @IsUUID()
  @Field(() => String, { description: 'Id del rol' })
  id: string;

  @IsString()
  @Field(() => String, { description: 'Nombre del rol' })
  nombre: string;

  @IsString()
  @Field(() => String, { description: 'Descripción del rol' })
  descripcion: string;
}
