import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { PersonasRolesService } from './personas_roles.service';
import { PersonaRol } from './entities/persona_rol.entity';
import { InsertPersonaRolInput } from './dto/insert-persona_rol.input';
import { UpdatePersonaRolInput } from './dto/update-persona_rol.input';
import { PersonaConRol } from './dto/persona-rol.output';

@Resolver(() => PersonaRol)
export class PersonasRolesResolver {
  constructor(private readonly personasRolesService: PersonasRolesService) {}

  @Query(() => [PersonaConRol])
  async getPersonasRoles(): Promise<PersonaConRol[]> {
    return await this.personasRolesService.getPersonasRoles();
  }

  @Mutation(() => PersonaRol)
  async insertPersonaRol(
    @Args('data', { type: () => InsertPersonaRolInput })
    data: InsertPersonaRolInput,
  ): Promise<PersonaRol> {
    return await this.personasRolesService.insert(data);
  }

  @Mutation(() => Boolean)
  async deletePersonaRol(
    @Args('persona_rol_id', { type: () => String }) persona_rol_id: string,
  ): Promise<boolean> {
    await this.personasRolesService.delete(persona_rol_id);
    return true;
  }

  @Mutation(() => [String])
  async getPermisos_ByPersonaAndRol(@Context() context): Promise<string[]> {
    return await this.personasRolesService.getPermisos_ByPersonaAndRol(
      context.req.user.sub,
      context.req.user.rol_activo,
    );
  }
}
