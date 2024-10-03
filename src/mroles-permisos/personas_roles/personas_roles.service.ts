import { Injectable } from '@nestjs/common';
import { InsertPersonaRolInput } from './dto/insert-persona_rol.input';
import { UpdatePersonaRolInput } from './dto/update-persona_rol.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { PersonaRol } from './entities/persona_rol.entity';
import { PersonaConRol } from './dto/persona-rol.output';
import { MailService } from 'src/mail/mail.service';
import { RolesPermisosService } from '../roles_permisos/roles_permisos.service';
import { Rol } from '../roles/entities/rol.entity';
import { RolesService } from '../roles/roles.service';
import { PaisesService } from 'src/modules/paises/paises.service';
import { Persona } from 'src/modules/personas/entities/persona.entity';
import { AccionPermiso } from 'src/mroles-permisos/utils/roles-permisos.enum';
import { MrolesPermisosCommonService } from '../mroles-permisos-common/mroles-permisos-common.service';

@Injectable()
export class PersonasRolesService {
  constructor(
    @InjectRepository(PersonaRol)
    private personaRolRepository: Repository<PersonaRol>,
    private rolesPermisosService: RolesPermisosService,
    private paisService: PaisesService,
    private rolesService: RolesService,
    private mail: MailService,
    private mRolesPermisosCommonService: MrolesPermisosCommonService,
  ) {}

  async getPersonasRoles(): Promise<PersonaConRol[]> {
    try {
      const personasRoles = await this.personaRolRepository.find({
        where: { rol: { nombre: Not(process.env.ROLE_USER) } },
        relations: ['rol', 'persona', 'persona.pais'],
      });
      const personas = await Promise.all(
        personasRoles.map(async (pr) => {
          const pais = await this.paisService.getPais_ById(pr.persona.pais_id);

          return {
            created_at: pr.persona.created_at,
            updated_at: pr.persona.updated_at,
            id: pr.persona.id,
            nombres: pr.persona.nombres,
            apellidos: pr.persona.apellidos,
            fecha_nacimiento: pr.persona.fecha_nacimiento,
            foto_perfil: pr.persona.foto_perfil,
            foto_perfil_google: pr.persona.foto_perfil_google,
            email: pr.persona.email,
            codigo_verificacion: pr.persona.codigo_verificacion,
            email_verificado: pr.persona.email_verificado,
            telefono: pr.persona.telefono,
            codigo_region: pr.persona.codigo_region,
            ciudad: pr.persona.ciudad,
            biografia: pr.persona.biografia,
            url_facebook: pr.persona.url_facebook,
            url_instagram: pr.persona.url_instagram,
            url_linkedin: pr.persona.url_linkedin,
            pais,
            persona_roles: {
              id: pr.id,
              personalizado: pr.personalizado,
              rol: pr.rol,
            },
          } as PersonaConRol;
        }),
      );
      return personas;
    } catch (error) {
      throw error;
    }
  }

  async insert(
    insertPersonaRolInput: InsertPersonaRolInput,
  ): Promise<PersonaRol> {
    try {
      const existingPersonaRol = await this.personaRolRepository.findOne({
        where: {
          persona_id: insertPersonaRolInput.persona_id,
          rol_id: insertPersonaRolInput.rol_id,
        },
        relations: ['persona', 'rol'],
      });
      if (existingPersonaRol)
        throw new Error('La persona ya tiene asignado el rol');
      const personaRolData = this.personaRolRepository.create(
        insertPersonaRolInput,
      );
      const personaRolSave =
        await this.personaRolRepository.save(personaRolData);
      const personaRol = await this.getPersonaRol_ById(personaRolSave.id);
      this.mail.sendUserConfirmationRoleAssigned(
        personaRol.persona,
        personaRol.rol,
      );
      return personaRol;
    } catch (error) {
      throw error;
    }
  }

  async asignarRolUser(persona: Persona): Promise<PersonaRol> {
    try {
      const rol: Rol = await this.rolesService.getRolUser();
      const existingPersonaRol = await this.personaRolRepository.findOne({
        where: { persona, rol },
        relations: ['persona', 'rol'],
      });
      if (existingPersonaRol)
        throw new Error('La persona ya tiene asignado el rol');
      const personaRolData = this.personaRolRepository.create({
        persona,
        rol,
      });
      const personaRolSave =
        await this.personaRolRepository.save(personaRolData);
      const personaRol = await this.getPersonaRol_ById(personaRolSave.id);
      return personaRol;
    } catch (error) {
      throw error;
    }
  }

  async getPersonaRol_ById(persona_rol_id: string): Promise<PersonaRol> {
    try {
      const personaRol = await this.personaRolRepository.findOne({
        where: { id: persona_rol_id },
        relations: ['rol', 'persona'],
      });
      if (!personaRol) throw new Error('PersonaRol no encontrado');
      return personaRol;
    } catch (error) {
      throw error;
    }
  }

  async delete(persona_rol_id: string): Promise<void> {
    try {
      const personaRol = await this.personaRolRepository.findOne({
        where: { id: persona_rol_id },
        relations: ['rol', 'persona'],
      });
      if (!personaRol) throw new Error('PersonaRol no encontrado');
      this.mRolesPermisosCommonService.deletePPP_ByPersonaRolId(persona_rol_id);
      await this.personaRolRepository.delete(persona_rol_id);
      this.mail.sendUserConfirmationRoleRemoved(
        personaRol.persona,
        personaRol.rol,
      );
    } catch (error) {
      throw error;
    }
  }

  async updatePersonalizado_ByPersonaRolId(id: string, personalizado: boolean) {
    try {
      await this.personaRolRepository.update(id, { personalizado });
    } catch (error) {
      throw error;
    }
  }

  async getPersonaRol_ByPersonaIdRolId(
    persona_id: string,
    rol_id: string,
  ): Promise<PersonaRol> {
    try {
      const personaRol = await this.personaRolRepository.findOne({
        where: { persona_id, rol_id },
        relations: ['rol', 'persona'],
      });
      if (!personaRol) throw new Error('PersonaRol no encontrado');
      return personaRol;
    } catch (error) {
      throw error;
    }
  }

  async getPermisos_ByPersonaAndRol(
    persona_id: string,
    rol_name: string,
  ): Promise<string[]> {
    try {
      let permisos = [];
      const personaRol = await this.personaRolRepository.findOne({
        where: { persona_id, rol: { nombre: rol_name } },
        relations: [
          'rol',
          'persona_permiso_personalizado',
          'persona_permiso_personalizado.permiso',
        ],
      });
      if (!personaRol) throw new Error('PersonaRol no encontrado');
      const roles_permiso =
        await this.rolesPermisosService.getRolPermiso_ByRolId(
          personaRol.rol_id,
        );
      let permisos_rol = roles_permiso.map((rp) => rp.permiso);
      const persona_permiso_personalizado =
        personaRol.persona_permiso_personalizado;
      permisos_rol.map((p) => {
        const permiso_personalizado = persona_permiso_personalizado.find(
          (pp) => pp.permiso_id === p.id,
        );
        if (permiso_personalizado) {
          if (permiso_personalizado.accion === AccionPermiso.QUITAR) {
            permisos_rol = permisos_rol.filter((pr) => pr.id !== p.id);
          }
        }
      });
      const permisos_totales = permisos_rol.concat(
        persona_permiso_personalizado
          .filter(
            (pp) =>
              pp.accion === AccionPermiso.AGREGAR &&
              !permisos_rol.find((pr) => pr.id === pp.permiso_id),
          )
          .map((pp) => pp.permiso),
      );
      permisos = permisos_totales
        .filter(
          (p, index, self) => index === self.findIndex((t) => t.id === p.id),
        )
        .map((p) => p.codigo);
      return permisos;
    } catch (error) {
      throw error;
    }
  }
}
