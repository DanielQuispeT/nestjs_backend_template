import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateDependenciasPermisoInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
