import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RolesPermisosService } from './roles_permisos.service';
import { RolPermiso } from './entities/rol_permiso.entity';
import { InsertRolPermisoInput } from './dto/insert-rol_permiso.input';
import { UpdateRolPermisoInput } from './dto/update-rol_permiso.input';

@Resolver(() => RolPermiso)
export class RolesPermisosResolver {
  constructor(private readonly rolesPermisosService: RolesPermisosService) {}

  @Mutation(() => RolPermiso)
  async insertRolPermiso(
    @Args('data') data: InsertRolPermisoInput,
  ): Promise<RolPermiso> {
    return await this.rolesPermisosService.insert(data);
  }

  @Mutation(() => RolPermiso)
  async updateRolPermiso(
    @Args('data') data: UpdateRolPermisoInput,
  ): Promise<RolPermiso> {
    return await this.rolesPermisosService.update(data);
  }

  @Mutation(() => Boolean)
  async deleteRolPermiso(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Boolean> {
    return await this.rolesPermisosService.delete(id);
  }

  @Query(() => RolPermiso)
  async getRolPermiso_ById(
    @Args('id', { type: () => String }) id: string,
  ): Promise<RolPermiso> {
    return await this.rolesPermisosService.getRolPermiso_ById(id);
  }

  @Query(() => [RolPermiso])
  async getRolesPermisos(): Promise<RolPermiso[]> {
    return await this.rolesPermisosService.getRolesPermisos();
  }

  @Query(() => [RolPermiso])
  async getRolPermiso_ByRolId(
    @Args('id', { type: () => String }) id: string,
  ): Promise<RolPermiso[]> {
    return await this.rolesPermisosService.getRolPermiso_ByRolId(id);
  }
}
