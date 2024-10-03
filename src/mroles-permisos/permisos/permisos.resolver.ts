import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PermisosService } from './permisos.service';
import { Permiso, PermisoEnum } from './entities/permiso.entity';
import { InsertPermisoInput } from './dto/insert-permiso.input';
import { UpdatePermisoInput } from './dto/update-permiso.input';
import { Public } from 'src/common/decorators/public.decorator';

@Resolver(() => Permiso)
export class PermisosResolver {
  constructor(private readonly permisosService: PermisosService) {}

  @Mutation(() => Permiso)
  async insertPermiso(
    @Args('data') data: InsertPermisoInput,
  ): Promise<Permiso> {
    return await this.permisosService.insert(data);
  }

  @Mutation(() => Permiso)
  async updatePermiso(
    @Args('data') data: UpdatePermisoInput,
  ): Promise<Permiso> {
    return await this.permisosService.update(data);
  }

  @Mutation(() => Boolean)
  async deletePermiso(@Args('id') id: string): Promise<boolean> {
    return await this.permisosService.delete(id);
  }

  @Query(() => [Permiso])
  async getPermisos(): Promise<Permiso[]> {
    return await this.permisosService.getPermisos();
  }

  @Query(() => Permiso)
  async getPermiso_ById(@Args('id') id: string): Promise<Permiso> {
    return await this.permisosService.getPermiso_ById(id);
  }

  @Public()
  @Query(() => PermisoEnum)
  async getPermisos_Codigo(): Promise<PermisoEnum> {
    const permisos = await this.permisosService.getPermisos_Codigo();
    return { permisos };
  }
}
