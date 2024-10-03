import { Injectable } from '@nestjs/common';
import { CreateDependenciasPermisoInput } from './dto/create-dependencias_permiso.input';
import { UpdateDependenciasPermisoInput } from './dto/update-dependencias_permiso.input';
import { DependenciaPermiso } from './entities/dependencias_permiso.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DependenciasPermisosService {
  constructor(
    @InjectRepository(DependenciaPermiso)
    private dependenciasPermisoRepository: Repository<DependenciaPermiso>,
  ) {}

  async insertMany_ByIds(
    permiso_ids_necesarios: string[],
    permiso_id: string,
  ): Promise<void> {
    try {
      const dependencias = permiso_ids_necesarios.map(
        (permiso_id_necesario) => {
          return this.dependenciasPermisoRepository.create({
            permiso_id,
            permiso_id_necesario,
          });
        },
      );
      await this.dependenciasPermisoRepository.save(dependencias);
    } catch (error) {
      throw new Error('Error al insertar las dependencias.');
    }
  }
  async deleteMany_ByIds(permiso_ids_necesarios: string[], permiso_id: string) {
    try {
      permiso_ids_necesarios.map(async (permiso_id_necesario) => {
        await this.dependenciasPermisoRepository.delete({
          permiso_id,
          permiso_id_necesario,
        });
      });
    } catch (error) {
      throw new Error('Error al eliminar las dependencias.');
    }
  }
  async delteMany_ByPermisoId(permiso_id: string) {
    try {
      await this.dependenciasPermisoRepository.delete({ permiso_id });
    } catch (error) {
      throw new Error('Error al eliminar las dependencias.');
    }
  }
}
