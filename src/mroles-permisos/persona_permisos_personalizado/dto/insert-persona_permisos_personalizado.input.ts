import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEnum, IsUUID } from 'class-validator';
import { AccionPermiso } from 'src/mroles-permisos/utils/roles-permisos.enum';

@InputType()
export class InsertPersonaPermisosPersonalizadoInput {
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
