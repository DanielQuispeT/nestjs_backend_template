import { CreateDependenciasPermisoInput } from './create-dependencias_permiso.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDependenciasPermisoInput extends PartialType(CreateDependenciasPermisoInput) {
  @Field(() => Int)
  id: number;
}
