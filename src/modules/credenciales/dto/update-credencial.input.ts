import { InsertCredencialInput } from './insert-credencial.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCredencialInput extends PartialType(InsertCredencialInput) {}
