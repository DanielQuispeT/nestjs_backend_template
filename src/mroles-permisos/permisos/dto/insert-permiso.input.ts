import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class InsertPermisoInput {
  @IsString()
  @Field(() => String)
  nombre: string;

  @IsString()
  @Field(() => String)
  descripcion: string;

  @IsString({ each: true }) //se usa el each para validar cada elemento del array
  @Field(() => [String])
  permisos_id_necesarios: string[];
}
