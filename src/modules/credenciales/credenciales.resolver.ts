import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { CredencialesService } from './credenciales.service';
import { Credencial } from './entities/credencial.entity';
import { InsertCredencialInput } from './dto/insert-credencial.input';
import { UpdateCredencialInput } from './dto/update-credencial.input';
import * as bcrypt from 'bcrypt';
import { CreateAccountInput } from './dto/create-account.input';
import { Public } from 'src/common/decorators/public.decorator';

@Resolver(() => Credencial)
export class CredencialesResolver {
  constructor(private readonly credencialesService: CredencialesService) {}

  @Public()
  @Query(() => String)
  async generateHash(@Args('password') password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  @Mutation(() => Boolean)
  async insertCredencial(
    @Args('persona_id') persona_id: string,
    @Args('password') password: string,
  ): Promise<boolean> {
    return await this.credencialesService.insertOne(persona_id, password);
  }

  @Public()
  @Mutation(() => Boolean)
  async createAccountUser(
    @Args('createAccountInput') createAccountInput: CreateAccountInput,
  ): Promise<boolean> {
    return await this.credencialesService.createAccount(createAccountInput);
  }

  @Public()
  @Mutation(() => Boolean)
  async updateCredentials(
    @Args('password') password: string,
    @Args('token') token: string,
  ): Promise<boolean> {
    return await this.credencialesService.updateCredentials(password, token);
  }

  @Mutation(() => Boolean)
  async updatePasswordUser(
    @Context() context: any,
    @Args('passwordNew') passwordNew: string,
    @Args('passwordCurrent', { nullable: true }) passwordCurrent?: string,
  ): Promise<boolean> {
    const authorization = context.req.headers.authorization;
    if (!authorization) throw new Error('No authorization header found');
    const token = authorization.split(' ')[1];
    return await this.credencialesService.updatePasswordUser(
      token,
      passwordNew,
      passwordCurrent,
    );
  }

  @Public()
  @Query(() => String, { name: 'verifyToken' })
  async verifyToken(@Args('token') token: string): Promise<string> {
    return await this.credencialesService.verifyToken(token);
  }
}
