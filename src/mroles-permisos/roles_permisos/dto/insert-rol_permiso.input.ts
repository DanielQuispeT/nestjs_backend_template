import { InputType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class InsertRolPermisoInput {
  @IsUUID()
  @Field(() => String)
  rol_id: string;

  @IsUUID()
  @Field(() => String)
  permiso_id: string;
}
