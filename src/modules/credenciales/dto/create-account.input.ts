import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Matches, MinLength } from 'class-validator';
import { InsertPersonaInput } from 'src/modules/personas/dto/insert-persona.input';

@InputType()
export class CreateAccountInput {
  @Field({ nullable: true })
  @IsOptional()
  @MinLength(6, { message: 'Password must have at least 6 characters' })
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).*$/, {
    message:
      'Password must have at least 6 characters, 1 number, 1 uppercase letter, and 1 special character.',
  })
  password?: string;

  @Field()
  persona: InsertPersonaInput;
}
