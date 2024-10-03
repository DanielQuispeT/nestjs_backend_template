import { InputType, Field } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { Persona } from 'src/modules/personas/entities/persona.entity';

@InputType()
export class InsertCredencialInput {
  @Field(() => Persona, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => Persona)
  persona?: Persona;
}
