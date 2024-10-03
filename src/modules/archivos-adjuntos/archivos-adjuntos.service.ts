import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArchivoAdjunto } from './entities/archivo-adjunto.entity';
import { Repository } from 'typeorm';
import { ArchivosService } from '../archivos/archivos.service';
import { ArchivoAdjuntoConArchivo } from './dto/archivo-adjunto-archivo.output';
import { Archivo } from '../archivos/entities/archivo.entity';
import { TablasEntidades } from 'src/common/enums/entidades.enum';
import { TipoAdjuntoEnum } from 'src/common/enums/archivo.enum';

@Injectable()
export class ArchivosAdjuntosService {
  constructor(
    @InjectRepository(ArchivoAdjunto)
    private archivoAdjuntoRepository: Repository<ArchivoAdjunto>,
    private archivosService: ArchivosService,
  ) {}

  async saveArchivosAdjuntos(
    nombre_tabla: TablasEntidades,
    registro_id: string,
    archivos_ids: string[],
    persona_id: string,
    tipo_adjunto: TipoAdjuntoEnum = TipoAdjuntoEnum.DEFAULT, // Valor por defecto
  ): Promise<ArchivoAdjunto[]> {
    let where = { nombre_tabla: nombre_tabla, registro_id: registro_id };
    if (tipo_adjunto) where['tipo_adjunto'] = tipo_adjunto;

    // Obtener los archivos actuales
    let registro_archivos = await this.archivoAdjuntoRepository.find({ where });

    let ids_para_eliminar: string[] = [];
    let archivos_ids_a_insertar: string[] = [];

    // Determinar archivos a eliminar y archivos a insertar
    for (const l_a of registro_archivos) {
      let index = archivos_ids.indexOf(l_a.archivo_id);
      if (index >= 0) {
        // Archivo encontrado, se mantiene
        archivos_ids.splice(index, 1); // Quitar el archivo de la lista de archivos a insertar
      } else {
        // Archivo no encontrado, marcar para eliminación
        ids_para_eliminar.push(l_a.id);
      }
    }

    // Eliminar archivos no deseados
    if (ids_para_eliminar.length > 0) {
      await this.archivoAdjuntoRepository.delete(ids_para_eliminar);
    }

    // Preparar archivos nuevos para insertar
    let r_a_para_insertar: Partial<ArchivoAdjunto>[] = archivos_ids.map(
      (a_id) => ({
        archivo_id: a_id,
        registro_id: registro_id,
        nombre_tabla: nombre_tabla,
        tipo_adjunto: tipo_adjunto, // Asegúrate de incluir el tipo_adjunto en los nuevos archivos
      }),
    );

    // Insertar archivos nuevos
    let r_a_insertados =
      await this.archivoAdjuntoRepository.save(r_a_para_insertar);

    // Obtener la lista actualizada de archivos adjuntos
    let nuevos_r_a = await this.archivoAdjuntoRepository.find({
      where: { registro_id: registro_id, nombre_tabla: nombre_tabla },
    });

    return nuevos_r_a;
  }

  async getArchivosAdjuntos_Registro(
    nombre_tabla: TablasEntidades,
    registro_id: string,
    persona_id: string,
    tipo_adjunto?: TipoAdjuntoEnum,
  ): Promise<ArchivoAdjunto[]> {
    let where = { nombre_tabla: nombre_tabla, registro_id: registro_id };
    if (tipo_adjunto) where['tipo_adjunto'] = tipo_adjunto;
    return await this.archivoAdjuntoRepository.find({ where });
  }
  async insertArchivoAdjunto(
    nombre_tabla: TablasEntidades,
    registro_id: string,
    archivo_id: string,
    tipo_adjunto?: TipoAdjuntoEnum,
  ): Promise<ArchivoAdjunto> {
    const data = this.archivoAdjuntoRepository.create({
      archivo_id: archivo_id,
      registro_id: registro_id,
      nombre_tabla: nombre_tabla,
      tipo_adjunto: tipo_adjunto,
    });
    return await this.archivoAdjuntoRepository.save(data);
  }
  async updateArchivoAdjunto(
    nombre_tabla: TablasEntidades,
    registro_id: string,
    nuevo_archivo_id: string,
    tipo_adjunto?: TipoAdjuntoEnum,
  ): Promise<ArchivoAdjunto> {
    const a_adjunto = await this.archivoAdjuntoRepository.findOne({
      where: { nombre_tabla, registro_id },
    });
    if (!a_adjunto) {
      throw new Error('El archivo adjunto a actualizar no fue encontrado.');
    }
    const delete_id = a_adjunto.archivo_id;

    if (nuevo_archivo_id && nuevo_archivo_id !== a_adjunto.archivo_id)
      a_adjunto.archivo_id = nuevo_archivo_id;

    const a_adjunto_act = await this.archivoAdjuntoRepository.save(a_adjunto);

    if (a_adjunto_act.archivo_id !== delete_id)
      await this.archivosService.deleteArchivo_ById(delete_id);

    return a_adjunto_act;
  }
  async updateArchivoAdjunto2(
    id: string,
    nombre_tabla: TablasEntidades,
    registro_id: string,
    archivo_id: string,
    // persona_id: string,
    tipo_adjunto: TipoAdjuntoEnum,
  ): Promise<ArchivoAdjunto> {
    try {
      let archivo_adjunto = await this.archivoAdjuntoRepository.findOne({
        where: { id },
      });
      const archivo_id_old = archivo_adjunto.archivo_id;
      if (archivo_adjunto) {
        archivo_adjunto.archivo_id = archivo_id;
        archivo_adjunto.nombre_tabla = nombre_tabla;
        archivo_adjunto.registro_id = registro_id;
      }
      const archivo_adjunto_updated =
        await this.archivoAdjuntoRepository.save(archivo_adjunto);
      await this.archivosService.deleteArchivo_ById(
        archivo_id_old,
        // persona_id
      );
      return archivo_adjunto_updated;
    } catch (error) {
      throw new Error('Error al actualizar el archivo adjunto.');
    }
  }
  async insertMany(
    archivos_ids: string[],
    registro_id: string,
    nombre_tabla: TablasEntidades,
    persona_id: string,
    tipo_adjunto?: TipoAdjuntoEnum,
  ): Promise<ArchivoAdjunto[]> {
    let r_a_para_insertar: Partial<ArchivoAdjunto>[] = [];
    for (const a_id of archivos_ids) {
      r_a_para_insertar.push({
        archivo_id: a_id,
        registro_id: registro_id,
        nombre_tabla: nombre_tabla,
      });
    }
    return await this.archivoAdjuntoRepository.save(r_a_para_insertar);
  }
  async deleteMany(
    ids: string[],
    persona_id: string,
    tipo_adjunto: TipoAdjuntoEnum = TipoAdjuntoEnum.DEFAULT,
  ): Promise<any> {
    for (const id of ids) {
      let archivo_adjunto = await this.archivoAdjuntoRepository.findOne({
        where: { id, tipo_adjunto },
      });
      if (archivo_adjunto) {
        await this.archivoAdjuntoRepository.delete(id);
        await this.archivosService.deleteArchivo_ById(
          archivo_adjunto.archivo_id,
          // persona_id,
        );
      }
    }
  }
  async getArchivoAdjunto_ByRegistroId(
    registro_id: string,
    nombre_tabla: TablasEntidades,
    tipo_adjunto: TipoAdjuntoEnum = TipoAdjuntoEnum.DEFAULT,
  ): Promise<ArchivoAdjuntoConArchivo> {
    let where = { registro_id, nombre_tabla };
    if (tipo_adjunto) where['tipo_adjunto'] = tipo_adjunto;
    const archivo_adjunto = await this.archivoAdjuntoRepository.findOne({
      where,
      relations: ['archivo'],
    });
    if (!archivo_adjunto) {
      return null;
    }
    const archivo: Archivo = await archivo_adjunto.archivo;
    return { archivo_adjunto, archivo };
  }
  async getArchivosAdjuntos_ByRegistroId(
    registro_id: string,
    nombre_tabla: TablasEntidades,
    tipo_adjunto: TipoAdjuntoEnum = TipoAdjuntoEnum.DEFAULT,
  ): Promise<ArchivoAdjuntoConArchivo[]> {
    const archivos_adjuntos = await this.archivoAdjuntoRepository.find({
      where: { registro_id, nombre_tabla, tipo_adjunto },
      relations: ['archivo'],
    });

    const archivosAdjuntosConArchivo = await Promise.all(
      archivos_adjuntos.map(async (archivo_adjunto) => {
        const archivo: Archivo = await archivo_adjunto.archivo;
        return { archivo_adjunto, archivo };
      }),
    );

    return archivosAdjuntosConArchivo || [];
  }

  async updateProfile(registro_id: string, archivo_id: string): Promise<void> {
    try {
      const nombre_tabla = TablasEntidades.PERSONAS;
      const archivo_adjunto = await this.archivoAdjuntoRepository.findOne({
        where: {
          nombre_tabla,
          registro_id,
          tipo_adjunto: TipoAdjuntoEnum.PERFIL,
        },
      });
      if (archivo_adjunto) {
        const archivoAnteriorId = archivo_adjunto.archivo_id;
        archivo_adjunto.archivo_id = archivo_id;
        await this.archivoAdjuntoRepository.save(archivo_adjunto);
        if (archivoAnteriorId !== archivo_id) {
          await this.archivosService.deletePerfil_ById(archivoAnteriorId);
        }
      } else {
        const nuevoArchivoAdjunto = this.archivoAdjuntoRepository.create({
          nombre_tabla,
          registro_id,
          archivo_id,
          tipo_adjunto: TipoAdjuntoEnum.PERFIL,
        });
        await this.archivoAdjuntoRepository.save(nuevoArchivoAdjunto);
      }
    } catch (error) {
      throw new Error('Error al actualizar el perfil');
    }
  }
}
