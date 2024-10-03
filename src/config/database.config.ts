import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuditoriaRegistro } from 'src/auditoria_registros/entities/auditoria_registro.entity';
import { InsertAdminDefault3009202414245 } from 'src/database/migrations/admin-default.migration';
import { ArchivoAdjunto } from 'src/modules/archivos-adjuntos/entities/archivo-adjunto.entity';
import { Archivo } from 'src/modules/archivos/entities/archivo.entity';
import { Credencial } from 'src/modules/credenciales/entities/credencial.entity';
import { Pais } from 'src/modules/paises/entities/pais.entity';
import { Persona } from 'src/modules/personas/entities/persona.entity';
import { DependenciaPermiso } from 'src/mroles-permisos/dependencias_permisos/entities/dependencias_permiso.entity';
import { Permiso } from 'src/mroles-permisos/permisos/entities/permiso.entity';
import { PersonaPermisoPersonalizado } from 'src/mroles-permisos/persona_permisos_personalizado/entities/persona_permisos_personalizado.entity';
import { PersonaRol } from 'src/mroles-permisos/personas_roles/entities/persona_rol.entity';
import { Rol } from 'src/mroles-permisos/roles/entities/rol.entity';
import { RolPermiso } from 'src/mroles-permisos/roles_permisos/entities/rol_permiso.entity';

export const MIGRATIONS = [InsertAdminDefault3009202414245];

export const ENTITIES = [
  //Archivos
  Archivo,
  ArchivoAdjunto,
  //Roles y permisos
  DependenciaPermiso,
  Permiso,
  PersonaPermisoPersonalizado,
  PersonaRol,
  Rol,
  RolPermiso,
  //Modules
  AuditoriaRegistro,
  Persona,
  Credencial,
  Pais,
];

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ENTITIES,
    synchronize: true,
    migrationsRun: true,
    logging: true,
    logger: 'file',
    migrations: MIGRATIONS,
    timezone: 'Z',
  }),
);
