import { Injectable } from '@nestjs/common';
import { Rol } from './entities/rol.entity';
import { InsertRolInput } from './dto/insert-rol.input';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { UpdateRolInput } from './dto/update-rol.input';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}
  async insert(insertRolInput: InsertRolInput): Promise<Rol> {
    try {
      const rol = this.rolRepository.create(insertRolInput);
      return await this.rolRepository.save(rol);
    } catch (error) {
      throw new Error('Error al insertar el rol.');
    }
  }
  async getRoles_ByPersonaId(id: string): Promise<Rol[]> {
    return await this.rolRepository.find({
      where: { personas_rol: { persona: { id } } },
    });
  }
  async getRoles(): Promise<Rol[]> {
    try {
      const roles = await this.rolRepository.find({
        relations: ['personas_rol'],
      });
      return roles;
    } catch (error) {
      throw new Error('Error al obtener los roles.');
    }
  }

  async getRol_ById(id: string): Promise<Rol> {
    try {
      const rol = await this.rolRepository.findOne({
        where: { id, deleted_at: IsNull() },
      });
      if (!rol) throw new Error('El rol no existe.');
      return rol;
    } catch (error) {
      throw new Error('Error al obtener el rol.');
    }
  }

  async getRol_ByNombre(nombre: string): Promise<Rol> {
    try {
      if (!nombre) throw new Error('El nombre del rol es requerido.');
      const rol = await this.rolRepository.findOne({
        where: { nombre, deleted_at: IsNull() },
        relations: ['permisos_rol'],
      });
      if (!rol) throw new Error('El rol no existe.');
      return rol;
    } catch (error) {
      throw error;
    }
  }

  async getRolUser(): Promise<Rol> {
    try {
      const rol = await this.rolRepository.findOne({
        where: { nombre: process.env.ROLE_USER },
      });
      if (!rol) throw new Error('El rol no existe.');
      return rol;
    } catch (error) {
      throw new Error('Error al obtener el rol.');
    }
  }

  async update(data: UpdateRolInput): Promise<Rol> {
    try {
      await this.rolRepository.update(data.id, data);
      return await this.rolRepository.findOne({
        where: { id: data.id },
      });
    } catch (error) {
      throw new Error('Error al actualizar el rol.');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const delete_rol = await this.rolRepository.softDelete(id);
      return delete_rol.affected === 1;
    } catch (error) {
      throw new Error('Error al eliminar el rol.');
    }
  }
}
