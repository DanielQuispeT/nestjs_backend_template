import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class InsertPaisInput {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  dial_code: string;

  @Field(() => String, { nullable: true })
  code: string;
}
