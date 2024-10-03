import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateArchivoInput {
  @Field({ nullable: false })
  id: string;

  @Field({ nullable: false })
  originalname: string;

  @Field({ nullable: false })
  filename: string;
}
