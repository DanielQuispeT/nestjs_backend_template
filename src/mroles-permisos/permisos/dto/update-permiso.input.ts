import { IsString, IsUUID } from 'class-validator';
import { InsertPermisoInput } from './insert-permiso.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePermisoInput extends PartialType(InsertPermisoInput) {
  @IsUUID()
  @Field(() => String)
  id: string;

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
