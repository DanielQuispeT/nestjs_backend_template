import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { PersonasService } from './personas.service';
import { Persona } from './entities/persona.entity';
import { InsertPersonaInput } from './dto/insert-persona.input';
import { UpdatePersonaInput } from './dto/update-persona.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { Public } from 'src/common/decorators/public.decorator';

@Resolver(() => Persona)
export class PersonasResolver {
  constructor(private readonly personasService: PersonasService) {}

  @Mutation(() => Persona)
  async insertPersona(
    @Args('insertPersonaInput') insertPersonaInput: InsertPersonaInput,
  ): Promise<Persona> {
    return await this.personasService.insert(insertPersonaInput);
  }

  @Query(() => [Persona])
  async getPersonas(): Promise<Persona[]> {
    return await this.personasService.getPersonas();
  }

  @Query(() => Persona)
  async getPersona_ById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Persona> {
    return await this.personasService.getPersona_ById(id);
  }

  @Mutation(() => Persona)
  async updatePersona(
    @Args('updatePersonaInput') updatePersonaInput: UpdatePersonaInput,
  ): Promise<Persona> {
    return await this.personasService.update(
      updatePersonaInput.id,
      updatePersonaInput,
    );
  }

  @Mutation(() => Boolean)
  async removePersona(
    @Args('id', { type: () => String }) id: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): Promise<Boolean> {
    return await this.personasService.remove(id);
  }

  @Query(() => [Persona])
  async getPersonasByEmail(
    @Args('email', { type: () => String }) email: string,
  ): Promise<Persona> {
    return await this.personasService.getPersona_ByEmail(email);
  }

  @Public()
  @Mutation(() => Boolean, { name: 'confirmCode' })
  async confirmCode(
    @Args('email', { type: () => String }) email: string,
    @Args('code', { type: () => String }) code: string,
  ): Promise<boolean> {
    return await this.personasService.confirmCode(email, code);
  }

  @Public()
  @Mutation(() => Boolean, { name: 'sendLinkRecoveryAccount' })
  async sendLinkRecoveryAccount(
    @Args('email', { type: () => String }) email: string,
  ): Promise<boolean> {
    return await this.personasService.recoveryAccount(email);
  }

  @Public()
  @Query(() => Persona, { name: 'verifyTokenRecovery' })
  async verifyTokenRecovery(
    @Args('token', { type: () => String }) token: string,
  ): Promise<Persona> {
    return await this.personasService.verifyTokenRecovery(token);
  }

  @Query(() => Persona)
  async getPesona_ByToken(@Context() context: any) {
    const authorization = context.req.headers.authorization;
    if (!authorization) throw new Error('No autenticado');
    const token = authorization.replace('Bearer ', '');
    return await this.personasService.getPesona_ByToken(token);
  }

  @Mutation(() => Persona)
  async updateProfile(
    @Context() context: any,
    @Args('data') data: UpdateProfileInput,
  ): Promise<Persona> {
    const authorization = context.req.headers.authorization;
    if (!authorization) throw new Error('No autenticado');
    const token = authorization.split(' ')[1];
    return await this.personasService.updateProfile(data, token);
  }
}
