import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

//para el enum de los permisos
@ObjectType()
export class PermisoEnum {
  @Field(() => GraphQLJSONObject)
  permisos: { [key: string]: string };
}
