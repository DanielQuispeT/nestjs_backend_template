import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonaPermisoPersonalizado } from '../persona_permisos_personalizado/entities/persona_permisos_personalizado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MrolesPermisosCommonService {
  constructor(
    @InjectRepository(PersonaPermisoPersonalizado)
    private personaPermisosPersonalizadoRepository: Repository<PersonaPermisoPersonalizado>,
  ) {}

  async deletePPP_ByPersonaRolId(persona_rol_id: string): Promise<void> {
    try {
      await this.personaPermisosPersonalizadoRepository.delete({
        persona_rol_id,
      });
    } catch (error) {
      throw new Error('Error al eliminar los permisos personalizados.');
    }
  }
}
