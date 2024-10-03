import { InputType, Int, Field } from '@nestjs/graphql';
import { IsBoolean, IsUUID } from 'class-validator';

@InputType()
export class InsertPersonaRolInput {
  @IsUUID()
  @Field(() => String)
  persona_id: string;

  @IsUUID()
  @Field(() => String)
  rol_id: string;
}
