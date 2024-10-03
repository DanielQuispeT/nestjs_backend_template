import { Field, ObjectType } from '@nestjs/graphql';
import {
  Payload_Access,
  Payload_Refresh,
} from 'src/auth/interfaces/auth.interface';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field((type) => [String])
  permissions: string[];
}

export interface CredentialsResponse {
  payload_access: Payload_Access;
  payload_refresh: Payload_Refresh;
  permissions: string[];
}
