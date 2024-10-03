import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Persona } from '../personas/entities/persona.entity';
import { Connection, IsNull, Repository } from 'typeorm';
import { Credencial } from './entities/credencial.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { InsertCredencialInput } from './dto/insert-credencial.input';
import { CreateAccountInput } from './dto/create-account.input';
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/mroles-permisos/roles/entities/rol.entity';
import { PersonaRol } from 'src/mroles-permisos/personas_roles/entities/persona_rol.entity';
import { PersonasService } from '../personas/personas.service';
import { PersonasRolesService } from 'src/mroles-permisos/personas_roles/personas_roles.service';
import { MailService } from 'src/mail/mail.service';
import { RolesService } from 'src/mroles-permisos/roles/roles.service';
import { createPayloads } from 'src/common/utils/auth';
import { CredentialsResponse } from './dto/auth-response.object';
import { InsertPersonaInput } from '../personas/dto/insert-persona.input';

@Injectable()
export class CredencialesService {
  constructor(
    @InjectRepository(Persona)
    private personaRepository: Repository<Persona>,
    @InjectRepository(Credencial)
    private readonly credencialRepository: Repository<Credencial>,
    private readonly personaService: PersonasService,
    private readonly personaRolService: PersonasRolesService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    @InjectConnection() private readonly connection: Connection,
    private readonly rolesServices: RolesService,
  ) {}
  async finOne_ByEmail(email: string) {
    const persona = await this.personaRepository.findOne({
      where: { email },
    });
    return persona;
  }
  async getPersona_ByEmail(email: string): Promise<Persona> {
    const persona = await this.personaRepository.findOne({
      where: { email },
    });
    return persona;
  }
  async insertOne(persona_id: string, password?: string): Promise<boolean> {
    const persona = await this.personaRepository.findOne({
      where: { id: persona_id },
    });
    const credencial = new Credencial();
    credencial.id = uuidv4();
    credencial.persona = persona;
    credencial.password = password;
    const insert = await this.credencialRepository.save(credencial);
    return insert ? true : false;
  }
  //
  async loginWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<CredentialsResponse> {
    try {
      const persona = await this.personaService.getPersona_ByEmail(email);
      if (!persona)
        throw new UnauthorizedException(
          `No existe el usuario con email ${email}.`,
        );

      if (persona.email_verificado === false)
        throw new UnauthorizedException(
          `Persona con email ${email} no ha verificado su correo electrónico.`,
        );
      const credencial = await this.getCredencial_ByPersonaId(persona.id);
      if (!credencial || !credencial.password)
        throw new UnauthorizedException(
          `No hay contraseña para el usuario con email ${email}.`,
        );
      const rolesPersona = await this.personaService.getRoles_ByPersonaId(
        persona.id,
      );
      const codigos_roles: string[] = rolesPersona.map(
        (rol: Rol) => rol.nombre,
      );
      let rol_activo = '';
      if (codigos_roles.includes(process.env.ROLE_USER))
        rol_activo = process.env.ROLE_USER;
      else
        throw new UnauthorizedException(`El usuario no tiene roles asignados.`);
      if (!(await bcrypt.compare(password, credencial.password)))
        throw new UnauthorizedException(
          `Contraseña incorrecta para el usuario con email ${email}.`,
        );
      const permissions =
        await this.personaRolService.getPermisos_ByPersonaAndRol(
          persona.id,
          rol_activo,
        );
      const { payload_access, payload_refresh } = await createPayloads(
        persona,
        codigos_roles,
        rol_activo,
        false,
      );

      return { payload_access, payload_refresh, permissions };
    } catch (error) {
      throw error;
    }
  }
  async loginAdmin(
    email: string,
    password: string,
  ): Promise<CredentialsResponse> {
    try {
      const persona = await this.personaService.getPersona_ByEmail(email);
      if (!persona) {
        throw new UnauthorizedException(
          `No existe el usuario con email ${email}.`,
        );
      }

      if (persona.email_verificado === false) {
        throw new UnauthorizedException(
          `Persona con email ${email} no ha verificado su correo electrónico.`,
        );
      }

      const credencial = await this.getCredencial_ByPersonaId(persona.id);
      if (!credencial || !credencial.password) {
        throw new UnauthorizedException(
          `No hay contraseña para el usuario con email ${email}.`,
        );
      }

      const rolesPersona = await this.personaService.getRoles_ByPersonaId(
        persona.id,
      );
      const codigos_roles: string[] = rolesPersona.map(
        (rol: Rol) => rol.nombre,
      );

      // Verificar que el usuario tenga otros roles además del rol "user"
      const otherRoles = codigos_roles.filter(
        (role) => role !== process.env.ROLE_USER,
      );
      if (otherRoles.length === 0) {
        throw new UnauthorizedException(
          `El usuario no tiene otros roles además de ${process.env.ROLE_USER}.`,
        );
      }

      // Ordenar los roles alfabéticamente
      codigos_roles.sort();

      // Establecer el rol activo como el primero diferente de "user"
      let rol_activo = codigos_roles.find(
        (role) => role !== process.env.ROLE_USER,
      );

      const state_subscription: boolean = true; // determinar si la persona tiene una suscripción activa

      if (!(await bcrypt.compare(password, credencial.password))) {
        throw new UnauthorizedException(
          `Contraseña incorrecta para el usuario con email ${email}.`,
        );
      }
      const subscripcion_activa = false;
      const permissions =
        await this.personaRolService.getPermisos_ByPersonaAndRol(
          persona.id,
          rol_activo,
        );

      const { payload_access, payload_refresh } = await createPayloads(
        persona,
        codigos_roles,
        rol_activo,
        subscripcion_activa,
      );

      return { payload_access, payload_refresh, permissions };
    } catch (error) {
      throw error;
    }
  }

  async getCredencial_ByPersonaId(persona_id: string) {
    const credencial = await this.credencialRepository.findOne({
      where: { persona: { id: persona_id } },
    });
    return credencial;
  }

  async create(newCredencial: InsertCredencialInput): Promise<Credencial> {
    return await this.credencialRepository.save({
      id: uuidv4(),
      ...newCredencial,
    });
  }

  generateCode(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#_%$&/()?¡';
    return Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length)),
    ).join('');
  }

  async googleRegisterOrLogin(profileData: any): Promise<CredentialsResponse> {
    const email = profileData.email;
    let persona: Persona = await this.personaService.getPersona_ByEmail(email);
    if (!persona) {
      persona = await this.personaService.insert({
        nombres: profileData.name,
        apellidos: profileData.lastName,
        email: profileData.email,
        fecha_nacimiento: undefined,
        telefono: null,
        codigo_region: null,
        pais_id: null,
        ciudad: null,
        biografia: null,
        url_linkedin: null,
        url_facebook: null,
        url_instagram: null,
        foto_perfil_google: profileData.picture,
        email_verificado: profileData.verified,
      } as InsertPersonaInput);
      await this.create({ persona: persona });
    }
    const rolesPersona = await this.personaService.getRoles_ByPersonaId(
      persona.id,
    );
    const codigos_roles: string[] = rolesPersona.map((rol: Rol) => rol.nombre);
    const { payload_access, payload_refresh } = await createPayloads(
      persona,
      codigos_roles,
      process.env.ROLE_USER,
      false,
    );
    const permissions =
      await this.personaRolService.getPermisos_ByPersonaAndRol(
        persona.id,
        process.env.ROLE_USER,
      );
    return { payload_access, payload_refresh, permissions };
  }
  async createAccount(input: CreateAccountInput): Promise<boolean> {
    const queryRunner = this.connection.createQueryRunner();
    const persona_email = await this.personaService.getPersona_ByEmail(
      input.persona.email,
    );
    if (persona_email) {
      throw new Error(`El email ${input.persona.email} ya está en uso.`);
    }
    const persona: Persona = new Persona();
    const credencial = new Credencial();
    const persona_rol = new PersonaRol();
    const rol = await this.rolesServices.getRolUser();

    credencial.id = uuidv4();
    credencial.password = input.password;
    Object.assign(persona, input.persona);
    persona.id = uuidv4();
    persona.email_verificado = false;
    persona.codigo_verificacion = this.generateCode();
    persona_rol.id = uuidv4();
    persona_rol.persona = persona;
    persona_rol.rol = rol;

    credencial.persona = persona;

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(persona);
      await queryRunner.manager.save(credencial);
      await queryRunner.manager.save(persona_rol);
      await queryRunner.commitTransaction();

      await this.mailService.sendUserVerificationCode(persona);

      return true;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async updateCredentials(password: string, token: string) {
    try {
      const persona = await this.personaService.verifyTokenRecovery(token);

      if (!persona) throw new UnauthorizedException('Token inválido');

      const newCredencial = await this.credencialRepository.update(
        {
          persona: { id: persona.id },
          deleted_at: IsNull(),
        },
        {
          password: await bcrypt.hash(password, 10),
        },
      );

      return newCredencial.affected === 1;
    } catch (error) {
      throw error;
    }
  }

  async updatePasswordUser(
    token: string,
    passwordNew: string,
    passwordCurrent?: string,
  ): Promise<boolean> {
    try {
      const payload = await this.verifyToken(token);
      const credencial = await this.getCredencial_ByPersonaId(payload.sub);
      if (!credencial) throw new Error('No existe credencial para el usuario');

      if (credencial.password) {
        if (!passwordCurrent) throw new Error('Contraseña actual es requerida');
        if (!(await bcrypt.compare(passwordCurrent, credencial.password)))
          throw new Error('Contraseña actual incorrecta');
      }

      const newHashedPassword = await bcrypt.hash(passwordNew, 10);
      const updateResult = await this.credencialRepository.update(
        {
          persona: { id: payload.sub },
          deleted_at: IsNull(),
        },
        {
          password: newHashedPassword,
        },
      );
      return updateResult.affected === 1;
    } catch (error) {
      throw error;
    }
  }

  async verifyToken(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET_KEY,
    });

    if (!payload) throw new UnauthorizedException('Token inválido');

    return payload;
  }

  async refreshAccessToken(
    refreshTokenOld: string,
  ): Promise<CredentialsResponse> {
    const payload = await this.jwtService.verifyAsync(refreshTokenOld, {
      secret: process.env.JWT_REFRESH_SECRET_KEY,
    });

    if (!payload) throw new UnauthorizedException('Token inválido');
    const persona = await this.personaService.getPersona_ById(payload.sub);

    const rolesPersona = await this.personaService.getRoles_ByPersonaId(
      payload.sub,
    );

    const codigos_roles: string[] = rolesPersona.map((rol: Rol) => rol.nombre);
    const subscripcion_activa = false;
    const permissions =
      await this.personaRolService.getPermisos_ByPersonaAndRol(
        payload.sub,
        payload.rol_activo,
      );

    const { payload_access, payload_refresh } = await createPayloads(
      persona,
      codigos_roles,
      payload.rol_activo,
      subscripcion_activa,
    );
    return { payload_access, payload_refresh, permissions };
  }

  generatePassword(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#_%$&/()?¡';
    return Array.from({ length: 10 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length)),
    ).join('');
  }
  async changeRole(token: string, rol: string): Promise<CredentialsResponse> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_REFRESH_SECRET_KEY,
    });
    if (payload.rol_activo === rol) {
      throw new Error('No se puede cambiar al mismo rol que ya tiene');
    }
    const persona = await this.personaService.getPersona_ById(payload.sub);
    const rolesPersona = await this.personaService.getRoles_ByPersonaId(
      payload.sub,
    );
    const rolExist = rolesPersona.find((r) => r.nombre === rol);
    if (!rolExist) {
      throw new Error('El rol que se quiere cambiar no existe');
    }
    const codigos_roles: string[] = rolesPersona.map((rol: Rol) => rol.nombre);

    const subscripcion_activa = false;
    const permissions =
      await this.personaRolService.getPermisos_ByPersonaAndRol(
        payload.sub,
        rol,
      );

    const { payload_access, payload_refresh } = await createPayloads(
      persona,
      codigos_roles,
      rol,
      subscripcion_activa,
    );

    return { payload_access, payload_refresh, permissions };
  }
}
