import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InsertPermisoInput } from './dto/insert-permiso.input';
import { UpdatePermisoInput } from './dto/update-permiso.input';
import { Permiso } from './entities/permiso.entity';
import { In, IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DependenciasPermisosService } from '../dependencias_permisos/dependencias_permisos.service';

@Injectable()
export class PermisosService {
  constructor(
    @InjectRepository(Permiso) private permisoRepository: Repository<Permiso>,
    private dependenciasService: DependenciasPermisosService,
  ) {}

  async insert(data: InsertPermisoInput): Promise<Permiso> {
    try {
      const permisos_id_necesarios = data.permisos_id_necesarios;
      const permisoData = await this.permisoRepository.create(data);
      permisoData.codigo = data.nombre.toLowerCase().replace(/\s/g, '_');
      const permiso = await this.permisoRepository.save(permisoData);
      this.dependenciasService.insertMany_ByIds(
        permisos_id_necesarios,
        permiso.id,
      );
      return await this.getPermiso_ById(permiso.id);
    } catch (error) {
      throw new Error('Error al insertar el permiso.');
    }
  }

  async update(data: UpdatePermisoInput): Promise<Permiso> {
    try {
      const permiso = await this.permisoRepository.findOne({
        where: { id: data.id, deleted_at: IsNull() },
        relations: ['dependencias_permiso'],
      });
      if (!permiso) throw new NotFoundException('Permiso no encontrado');
      const dependencias_old = permiso.dependencias_permiso.map(
        (dependencia) => dependencia.permiso_id_necesario,
      );
      const dependencias_new = data.permisos_id_necesarios;
      const dependencias_to_delete = dependencias_old.filter(
        (dependencia) => !dependencias_new.includes(dependencia),
      );
      const dependencias_to_insert = dependencias_new.filter(
        (dependencia) => !dependencias_old.includes(dependencia),
      );
      if (dependencias_to_delete.length > 0)
        this.dependenciasService.deleteMany_ByIds(
          dependencias_to_delete,
          data.id,
        );

      if (dependencias_to_insert.length > 0)
        this.dependenciasService.insertMany_ByIds(
          dependencias_to_insert,
          data.id,
        );
      const permisoToUpdate = {
        codigo: data.nombre.toLowerCase().replace(/\s/g, '_'),
        nombre: data.nombre,
        descripcion: data.descripcion,
      } as Permiso;
      await this.permisoRepository.update(data.id, permisoToUpdate);
      return await this.getPermiso_ById(data.id);
    } catch (error) {
      throw new Error('Error al actualizar el permiso.');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const delete_permiso = await this.permisoRepository.softDelete(id);
      if (delete_permiso.affected === 1)
        this.dependenciasService.delteMany_ByPermisoId(id);
      return delete_permiso.affected === 1;
    } catch (error) {
      throw new Error('Error al eliminar el permiso.');
    }
  }

  async getPermisos(): Promise<Permiso[]> {
    try {
      return await this.permisoRepository.find({
        relations: ['dependencias_permiso'],
      });
    } catch (error) {
      throw new Error('Error al obtener los permisos.');
    }
  }

  async getPermiso_ById(id: string): Promise<Permiso> {
    try {
      const permiso = await this.permisoRepository.findOne({
        where: { id },
        relations: ['dependencias_permiso'],
      });
      if (!permiso) throw new Error('El permiso no existe.');
      return permiso;
    } catch (error) {
      throw new Error('Error al obtener el permiso.');
    }
  }

  async getPermisos_Codigo(): Promise<{ [key: string]: string }> {
    try {
      const permisos = await this.permisoRepository.find({
        select: ['codigo'],
      });
      const permisosEnum = permisos.reduce((acc, permiso) => {
        acc[permiso.codigo] = permiso.codigo;
        return acc;
      }, {});
      return permisosEnum;
    } catch (error) {
      throw new Error('Error al obtener los permisos.');
    }
  }

  async getCodigoPermisos_ByCodigos(codigos: string[]): Promise<string[]> {
    try {
      let permisos = await this.permisoRepository.find({
        where: { codigo: In(codigos) },
        select: ['codigo'],
        relations: ['dependencias_permiso', 'dependencias_permiso.permiso'],
      });

      // Obtener códigos de dependencias
      const codigosDependencias = [];
      for (const permiso of permisos) {
        const dependenciasPermiso = permiso.dependencias_permiso;
        for (const dependencia of dependenciasPermiso) {
          const permisoDependiente = await this.getPermiso_ById(
            dependencia.permiso_id_necesario,
          );
          codigosDependencias.push(permisoDependiente.codigo);
        }
      }

      // Unir códigos y eliminar duplicados
      const codigosUnicos = new Set(
        permisos.map((permiso) => permiso.codigo).concat(codigosDependencias),
      );
      return Array.from(codigosUnicos);
    } catch (error) {
      throw new Error('Error al obtener los permisos.');
    }
  }
}
