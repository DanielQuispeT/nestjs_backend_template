import { IsUUID } from 'class-validator';
import { InsertRolPermisoInput } from './insert-rol_permiso.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRolPermisoInput extends PartialType(InsertRolPermisoInput) {
  @IsUUID()
  @Field(() => String)
  id: string;

  @IsUUID()
  @Field(() => String)
  rol_id: string;

  @IsUUID()
  @Field(() => String)
  permiso_id: string;
}
