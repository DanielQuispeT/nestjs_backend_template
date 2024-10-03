import { InputType, Int, Field } from '@nestjs/graphql';
import { TablasEntidades } from 'src/common/enums/entidades.enum';

@InputType()
export class AuditoriaInput {
  @Field(() => TablasEntidades)
  entidad_nombre: TablasEntidades;

  @Field(() => String)
  entidad_id: string;

  @Field(() => String)
  accion: string;

  @Field(() => String)
  persona_id: string;

  @Field(() => String, { nullable: true })
  datos_anteriores?: any;

  @Field(() => String, { nullable: true })
  datos_nuevos?: any;
}
