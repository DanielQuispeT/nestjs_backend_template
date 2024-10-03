import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PersonaPermisosPersonalizadoService } from './persona_permisos_personalizado.service';
import { PersonaPermisoPersonalizado } from './entities/persona_permisos_personalizado.entity';
import { InsertPersonaPermisosPersonalizadoInput } from './dto/insert-persona_permisos_personalizado.input';
import { UpdatePersonaPermisosPersonalizadoInput } from './dto/update-persona_permisos_personalizado.input';

@Resolver(() => PersonaPermisoPersonalizado)
export class PersonaPermisosPersonalizadoResolver {
  constructor(
    private readonly personaPermisosPersonalizadoService: PersonaPermisosPersonalizadoService,
  ) {}

  @Query(() => [PersonaPermisoPersonalizado])
  async getPermisosPersonalizados_ByPersonaRolId(
    @Args('persona_rol_id', { type: () => String }) persona_rol_id: string,
  ): Promise<PersonaPermisoPersonalizado[]> {
    return this.personaPermisosPersonalizadoService.getPermisosPersonalizados_ByPersonaId(
      persona_rol_id,
    );
  }

  @Mutation(() => [PersonaPermisoPersonalizado])
  async insertManyPersonaPermisosPersonalizado(
    @Args({
      name: 'data',
      type: () => [InsertPersonaPermisosPersonalizadoInput],
    })
    data: [InsertPersonaPermisosPersonalizadoInput],
  ): Promise<PersonaPermisoPersonalizado[]> {
    return this.personaPermisosPersonalizadoService.insertMany(data);
  }
}
