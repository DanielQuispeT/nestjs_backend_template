import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DependenciasPermisosService } from './dependencias_permisos.service';
import { DependenciaPermiso } from './entities/dependencias_permiso.entity';
import { CreateDependenciasPermisoInput } from './dto/create-dependencias_permiso.input';
import { UpdateDependenciasPermisoInput } from './dto/update-dependencias_permiso.input';

@Resolver(() => DependenciaPermiso)
export class DependenciasPermisosResolver {
  constructor(
    private readonly dependenciasPermisosService: DependenciasPermisosService,
  ) {}
}
