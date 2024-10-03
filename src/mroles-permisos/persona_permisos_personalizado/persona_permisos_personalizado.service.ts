import { Injectable } from '@nestjs/common';
import { InsertPersonaPermisosPersonalizadoInput } from './dto/insert-persona_permisos_personalizado.input';
import { UpdatePersonaPermisosPersonalizadoInput } from './dto/update-persona_permisos_personalizado.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonaPermisoPersonalizado } from './entities/persona_permisos_personalizado.entity';
import { PersonasRolesService } from '../personas_roles/personas_roles.service';
import { AccionPermiso } from 'src/mroles-permisos/utils/roles-permisos.enum';

@Injectable()
export class PersonaPermisosPersonalizadoService {
  constructor(
    @InjectRepository(PersonaPermisoPersonalizado)
    private repository: Repository<PersonaPermisoPersonalizado>,
    private personaRolService: PersonasRolesService,
  ) {}

  async getPermisosPersonalizados_ByPersonaId(
    persona_rol_id: string,
  ): Promise<PersonaPermisoPersonalizado[]> {
    try {
      const permisos = await this.repository.find({
        where: { persona_rol_id },
        relations: ['permiso', 'permiso.dependencias_permiso'],
      });
      return permisos;
    } catch (error) {
      throw new Error('Error al obtener los permisos personalizados.');
    }
  }

  async insertPersonaPermiso(
    input: InsertPersonaPermisosPersonalizadoInput,
  ): Promise<PersonaPermisoPersonalizado | null> {
    let accion = input.accion as AccionPermiso;
    let result: PersonaPermisoPersonalizado | null = null;
    const { permiso_id, persona_rol_id } = input;
    const existingPermiso = await this.repository.findOne({
      where: { permiso_id, persona_rol_id },
    });

    if (existingPermiso) {
      if (existingPermiso.accion !== accion)
        await this.repository.remove(existingPermiso);
    } else {
      const nuevoPermiso = this.repository.create({
        accion,
        permiso_id,
        persona_rol_id,
      });
      result = await this.repository.save(nuevoPermiso);
    }
    this.personaRolService.updatePersonalizado_ByPersonaRolId(
      persona_rol_id,
      await this.checkPermisosPersonalizados(persona_rol_id),
    );
    return result;
  }

  async insertMany(
    data: InsertPersonaPermisosPersonalizadoInput[],
  ): Promise<PersonaPermisoPersonalizado[]> {
    try {
      const permisosPromise = data.map(async (permiso) => {
        const p = await this.insertPersonaPermiso(permiso);

        return p;
      });
      const permisos = (await Promise.all(permisosPromise)).filter(
        (permiso) => permiso !== null && permiso !== undefined,
      );

      return permisos;
    } catch (error) {
      throw new Error('Error al insertar los permisos personalizados.');
    }
  }
  async checkPermisosPersonalizados(persona_rol_id: string): Promise<boolean> {
    try {
      const permisos = await this.repository.find({
        where: { persona_rol_id },
      });
      if (permisos.length > 0) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error('Error al obtener los permisos personalizados.');
    }
  }
}
