import {
  Payload_Access,
  Payload_Refresh,
} from 'src/auth/interfaces/auth.interface';
import { Persona } from 'src/modules/personas/entities/persona.entity';

export async function createPayloads(
  persona: Persona,
  codigos_roles: string[],
  rol_activo: string,
  suscripcion_activa: boolean,
): Promise<{
  payload_access: Payload_Access;
  payload_refresh: Payload_Refresh;
}> {
  const payload_access: Payload_Access = {
    sub: persona.id,
    email: persona.email,
    apellidos: persona.apellidos,
    foto_perfil: persona.foto_perfil,
    nombres: persona.nombres,
    rol_activo: rol_activo || process.env.ROLE_USER,
    roles: codigos_roles,
    suscripcion_activa,
  };
  const payload_refresh: Payload_Refresh = { sub: persona.id };
  return { payload_access, payload_refresh };
}
