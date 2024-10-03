import { IsEnum, IsUUID } from 'class-validator';
import { InsertPersonaPermisosPersonalizadoInput } from './insert-persona_permisos_personalizado.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { AccionPermiso } from 'src/mroles-permisos/utils/roles-permisos.enum';

@InputType()
export class UpdatePersonaPermisosPersonalizadoInput extends PartialType(
  InsertPersonaPermisosPersonalizadoInput,
) {
  @IsUUID('4', { message: 'Invalid UUID format' })
  @Field(() => String)
  id: string;

  @IsEnum(AccionPermiso)
  @Field()
  accion: AccionPermiso;

  @IsUUID('4', { message: 'Invalid UUID format' })
  @Field(() => String)
  permiso_id: string;

  @IsUUID('4', { message: 'Invalid UUID format' })
  @Field(() => String)
  persona_rol_id: string;
}
