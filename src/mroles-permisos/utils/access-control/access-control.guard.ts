import {
  CanActivate,
  ContextType,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AssignedPermissions } from '../permissions.config';
import { Permiso } from 'src/mroles-permisos/permisos/entities/permiso.entity';
import { PersonaPermisoPersonalizado } from 'src/mroles-permisos/persona_permisos_personalizado/entities/persona_permisos_personalizado.entity';
import { AccionPermiso } from '../roles-permisos.enum';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IS_PUBLIC_KEY } from 'src/common/constants/key-decorators.constant';
import { PermisosService } from 'src/mroles-permisos/permisos/permisos.service';
import { PersonaPermisosPersonalizadoService } from 'src/mroles-permisos/persona_permisos_personalizado/persona_permisos_personalizado.service';
import { PersonasRolesService } from 'src/mroles-permisos/personas_roles/personas_roles.service';
import { RolesService } from 'src/mroles-permisos/roles/roles.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AccessControlGuard implements CanActivate {
  constructor(
    private readonly permisosService: PermisosService,
    private readonly pppService: PersonaPermisosPersonalizadoService,
    private readonly personaRolService: PersonasRolesService,
    private readonly rolService: RolesService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // En caso de que sea publico, permitir el acceso
      const isPublic = this.reflector.get<boolean>(
        IS_PUBLIC_KEY,
        context.getHandler(),
      );
      if (isPublic) return true;

      const request = this.getRequest(context);
      const { sub, rol_activo } = request.user;

      const handler = context.getHandler().name;
      const parentType = context.getClass().name;
      const method = `${parentType}.${handler}`;

      const methodConfig = AssignedPermissions[method];

      if (!methodConfig) return true;
      const permissions = methodConfig;

      const rol = await this.rolService.getRol_ByNombre(rol_activo);

      const permisos_requeridos =
        await this.permisosService.getCodigoPermisos_ByCodigos(permissions);
      const permisos_rol = rol.permisos_rol.map((rp) => rp.permiso);

      const personaRol =
        await this.personaRolService.getPersonaRol_ByPersonaIdRolId(
          sub,
          rol.id,
        );
      const permisos_personalizados =
        await this.pppService.getPermisosPersonalizados_ByPersonaId(
          personaRol.id,
        );

      const permisos = this.centralizarPermisos(
        permisos_rol,
        permisos_personalizados,
      );

      //verificar si tiene los permisos requeridos
      const tienePermisos = permisos_requeridos.every((permiso) =>
        permisos.some((p) => p.codigo === permiso),
      );

      if (!tienePermisos) {
        throw new UnauthorizedException('No tiene permisos suficientes');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  getRequest(context: ExecutionContext) {
    if (context.getType<ContextType | 'graphql'>() === 'graphql') {
      return GqlExecutionContext.create(context).getContext().req;
    }
    return context.switchToHttp().getRequest();
  }

  centralizarPermisos(
    permisos_rol: Permiso[],
    permisos_personalizados: PersonaPermisoPersonalizado[],
  ) {
    let permisos = [...permisos_rol];

    const permisos_agregar: Permiso[] = permisos_personalizados
      .filter((pp) => pp.accion === AccionPermiso.AGREGAR)
      .map((pp) => pp.permiso);
    const permisos_quitar: string[] = permisos_personalizados
      .filter((pp) => pp.accion === AccionPermiso.QUITAR)
      .map((pp) => pp.permiso.id);
    permisos = permisos.filter((p) => !permisos_quitar.includes(p.id));
    permisos = [...permisos, ...permisos_agregar];

    return permisos;
  }
}
