import { Injectable } from '@nestjs/common';
import { InsertRolPermisoInput } from './dto/insert-rol_permiso.input';
import { UpdateRolPermisoInput } from './dto/update-rol_permiso.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolPermiso } from './entities/rol_permiso.entity';

@Injectable()
export class RolesPermisosService {
  constructor(
    @InjectRepository(RolPermiso)
    private rolPermisoRepository: Repository<RolPermiso>,
  ) {}

  async insert(data: InsertRolPermisoInput): Promise<RolPermiso> {
    try {
      const rolPermisoExist = await this.rolPermisoRepository.findOne({
        where: { rol_id: data.rol_id, permiso_id: data.permiso_id },
      });
      if (rolPermisoExist)
        throw new Error('Ya existe un rol_permiso con estos datos.');
      const rolPermisoData = this.rolPermisoRepository.create(data);
      const rolPermiso = await this.rolPermisoRepository.save(rolPermisoData);
      return await this.getRolPermiso_ById(rolPermiso.id);
    } catch (error) {
      throw new Error('Error al insertar el rol_permiso.');
    }
  }

  async update(data: UpdateRolPermisoInput): Promise<RolPermiso> {
    try {
      const rolPermiso = await this.rolPermisoRepository.findOne({
        where: { id: data.id },
      });
      if (!rolPermiso) throw new Error('Rol_permiso no encontrado.');
      await this.rolPermisoRepository.update(data.id, data);
      return await this.getRolPermiso_ById(data.id);
    } catch (error) {
      throw new Error('Error al actualizar el rol_permiso.');
    }
  }

  async delete(id: string): Promise<Boolean> {
    try {
      const result = await this.rolPermisoRepository.delete(id);
      if (result.affected === 0)
        throw new Error('Error al eliminar el rol_permiso.');
      return true;
    } catch (error) {
      throw new Error('Error al eliminar el rol_permiso.');
    }
  }

  async getRolPermiso_ById(id: string): Promise<RolPermiso> {
    try {
      const rolPermiso = await this.rolPermisoRepository.findOne({
        where: { id },
        relations: ['rol', 'permiso'],
      });
      if (!rolPermiso) throw new Error('Rol_permiso no encontrado.');
      return rolPermiso;
    } catch (error) {
      throw new Error('Error al obtener el rol_permiso.');
    }
  }

  async getRolesPermisos(): Promise<RolPermiso[]> {
    try {
      const rolesPermisos = await this.rolPermisoRepository.find({
        relations: ['rol', 'permiso'],
      });
      return rolesPermisos;
    } catch (error) {
      throw new Error('Error al obtener los roles_permisos.');
    }
  }

  async getRolPermiso_ByRolId(rol_id: string): Promise<RolPermiso[]> {
    try {
      const rolesPermisos = await this.rolPermisoRepository.find({
        where: { rol_id },
        relations: ['rol', 'permiso'],
      });
      return rolesPermisos;
    } catch (error) {
      throw new Error('Error al obtener los roles_permisos.');
    }
  }
}
