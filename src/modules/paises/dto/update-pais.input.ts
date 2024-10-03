import { InsertPaisInput } from './insert-pais.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePaisInput extends PartialType(InsertPaisInput) {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  dial_code: string;

  @Field(() => String, { nullable: true })
  code: string;
}
