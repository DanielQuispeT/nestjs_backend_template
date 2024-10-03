import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { InsertPersonaInput } from './dto/insert-persona.input';
import { UpdatePersonaInput } from './dto/update-persona.input';
import { Persona } from './entities/persona.entity';
import { JwtService } from '@nestjs/jwt';
import { UpdateProfileInput } from './dto/update-profile.input';
import { RedSocial } from './persona.enum';
import { MailService } from 'src/mail/mail.service';
import { ArchivosAdjuntosService } from '../archivos-adjuntos/archivos-adjuntos.service';
import { RolesService } from 'src/mroles-permisos/roles/roles.service';
import { PersonasRolesService } from 'src/mroles-permisos/personas_roles/personas_roles.service';
import { Rol } from 'src/mroles-permisos/roles/entities/rol.entity';
import { validate_url } from 'src/common/utils/validations';

@Injectable()
export class PersonasService {
  constructor(
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    private readonly jwtService: JwtService,
    private readonly personasRolesService: PersonasRolesService,
    private readonly rolesService: RolesService,
    private readonly mailService: MailService,
    private readonly archivosAdjuntosService: ArchivosAdjuntosService,
  ) {}

  async getPersonas(): Promise<Persona[]> {
    try {
      const personas = await this.personaRepository.find({
        relations: ['persona_roles', 'persona_roles.rol', 'pais'],
      });

      if (!personas || personas.length === 0) {
        throw new Error('No se encontraron personas.');
      }
      return personas;
    } catch (error) {
      if (error.message.includes('encontraron')) throw error;
      else throw new Error('Error al obtener la lista de personas.');
    }
  }

  async getPersona_ById(id: string): Promise<Persona> {
    try {
      const persona = await this.personaRepository.findOne({
        where: { id },
      });
      if (!persona) {
        throw new Error(`No se encontró la persona con ID ${id}.`);
      }
      return persona || null;
    } catch (error) {
      if (error.message.includes('encontró')) throw error;
      else throw new Error(`Error al obtener la persona con ID ${id}.`);
    }
  }

  async insert(insertPersonaInput: InsertPersonaInput): Promise<Persona> {
    try {
      const personaData = this.personaRepository.create(insertPersonaInput);
      if (await this.checkEmail(personaData.email)) {
        throw new Error('El email ya está registrado.');
      }
      const persona = await this.personaRepository.save(personaData);
      await this.personasRolesService.asignarRolUser(persona);
      return persona;
    } catch (error) {
      if (error.message.includes('ya está')) throw error;
      else if (error.message.includes('validación')) throw error;
      else throw error;
    }
  }

  async update(
    id: string,
    updatePersonaInput: UpdatePersonaInput,
  ): Promise<Persona> {
    try {
      const urls: { url: string; tipo: RedSocial }[] = [
        updatePersonaInput.url_linkedin
          ? { url: updatePersonaInput.url_linkedin, tipo: RedSocial.LINKEDIN }
          : null,
        updatePersonaInput.url_facebook
          ? { url: updatePersonaInput.url_facebook, tipo: RedSocial.FACEBOOK }
          : null,
        updatePersonaInput.url_instagram
          ? { url: updatePersonaInput.url_instagram, tipo: RedSocial.INSTAGRAM }
          : null,
      ].filter((url) => url);
      let mensajeError = 'Urls invalidas:\n';
      for (const url of urls) {
        if (!(await validate_url(url.url))) {
          mensajeError += ` · La URL de ${url.tipo} "${url.url}" no es válida.\n`;
        }
      }
      if (mensajeError !== 'Urls invalidas:\n') {
        throw new Error(mensajeError);
      }
      await this.personaRepository.update(id, updatePersonaInput);
      return await this.getPersona_ById(id);
    } catch (error) {
      if (error.message.includes('Urls invalidas')) throw error;
      else throw new Error('Error al actualizar la persona');
    }
  }

  async updateProfile(
    data: UpdateProfileInput,
    token: string,
  ): Promise<Persona> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY_ACCESS,
      });
      if (!payload) throw new BadRequestException('Token inválido');
      const id = payload.sub;
      const urls: { url: string; tipo: RedSocial }[] = [
        data.url_linkedin
          ? { url: data.url_linkedin, tipo: RedSocial.LINKEDIN }
          : null,
        data.url_facebook
          ? { url: data.url_facebook, tipo: RedSocial.FACEBOOK }
          : null,
        data.url_instagram
          ? { url: data.url_instagram, tipo: RedSocial.INSTAGRAM }
          : null,
      ].filter((url) => url);
      let mensajeError = 'Urls invalidas:\n';
      for (const url of urls) {
        if (!(await validate_url(url.url))) {
          mensajeError += ` · La URL de ${url.tipo} "${url.url}" no es válida.\n`;
        }
      }
      if (mensajeError !== 'Urls invalidas:\n') throw new Error(mensajeError);
      const persona = this.personaRepository.create(data);
      await this.personaRepository.update(id, persona);
      if (data.foto_perfil_id && data.foto_perfil) {
        await this.archivosAdjuntosService.updateProfile(
          id,
          data.foto_perfil_id,
        );
      }
      return await this.getPersona_ById(id);
    } catch (error) {
      if (error.message.includes('Urls invalidas')) throw error;
      else throw new Error('Error al actualizar tu perfil');
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      return (
        (
          await this.personaRepository.update(id, {
            deleted_at: new Date(),
          })
        ).affected === 1
      );

      /* */
    } catch (error) {
      throw new Error('Error al eliminar la persona');
    }
  }

  async getPersona_ByEmail(email: string): Promise<Persona> {
    const res = await this.personaRepository.findOne({
      where: { email },
      relations: ['credencial', 'pais'],
    });
    return res;
  }

  async getRoles_ByPersonaId(id: string): Promise<Rol[]> {
    const roles = await this.rolesService.getRoles_ByPersonaId(id);
    return roles;
  }

  async checkEmail(email: string): Promise<boolean> {
    const res = await this.personaRepository.findOne({
      where: {
        email,
      },
    });
    return res ? true : false;
  }

  async confirmCode(email: string, code: string): Promise<boolean> {
    try {
      const persona = await this.personaRepository.findOne({
        where: { email, codigo_verificacion: code, deleted_at: null },
      });

      if (!persona) {
        throw new BadRequestException('Código de verificación inválido');
      }
      persona.email_verificado = true;

      const personaUpdated = await this.personaRepository.save(persona);

      return personaUpdated ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async recoveryAccount(email: string): Promise<boolean> {
    const persona = await this.personaRepository.findOne({
      where: { email, deleted_at: IsNull() },
    });

    if (!persona) {
      throw new BadRequestException('Email no registrado');
    }

    const newToken = await this.jwtService.sign(
      { id: persona.id },
      { secret: process.env.JWT_SECRET_KEY_ACCESS },
    );

    const link = `${process.env.FRONTEND_URL_CLIENT}/recovery-account/${newToken}`;

    await this.mailService.sendLinkRecoveryAccount(persona, link);

    return true;
  }

  async verifyTokenRecovery(token: string): Promise<Persona> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY_ACCESS,
      });

      if (!payload) {
        throw new BadRequestException('Token inválido');
      }

      const user = await this.getPersona_ById(payload?.id);
      return user;
    } catch (error) {
      throw new BadRequestException('Token inválido');
    }
  }

  async getPesona_ByToken(token: string): Promise<Persona> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY_ACCESS,
      });
      if (!payload) throw new BadRequestException('Token inválido');

      const persona = await this.personaRepository.findOne({
        where: { id: payload.sub },
        relations: ['credencial', 'pais'],
      });
      return persona;
    } catch (error) {
      throw error;
    }
  }
}
