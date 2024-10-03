import { InsertPersonaRolInput } from './insert-persona_rol.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePersonaRolInput extends PartialType(InsertPersonaRolInput) {
  @Field(() => Int)
  id: number;
}
