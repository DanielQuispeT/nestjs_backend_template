import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArchivoInput } from './dto/archivo.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Archivo } from './entities/archivo.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { TipoAdjuntoEnum } from 'src/common/enums/archivo.enum';
import { TablasEntidades } from 'src/common/enums/entidades.enum';

@Injectable()
export class ArchivosService {
  private readonly rutaCarpetaArchivos = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'files',
    'archivos',
  );
  private readonly rutaCarpetaPerfiles = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'files',
    'perfiles',
  );
  constructor(
    @InjectRepository(Archivo)
    private archivoRepository: Repository<Archivo>,
  ) {}

  async getArchivoReciboTransaccion_ByRegistroId_ByNombreTabla(
    registro_id: string,
    nombre_tabla: TablasEntidades,
    tipo_adjunto: TipoAdjuntoEnum,
  ): Promise<Archivo> {
    return this.archivoRepository.findOne({
      where: {
        archivos_adjuntos: {
          registro_id,
          tipo_adjunto,
          nombre_tabla,
        },
      },
    });
  }

  async insertArchivo(
    input: CreateArchivoInput,
    persona_id: string,
  ): Promise<any> {
    try {
      const id = input.id || uuidv4();
      const archivo = new Archivo();
      archivo.id = id;
      archivo.filename = input.filename;
      archivo.originalname = input.originalname;
      const result = await this.archivoRepository.save(archivo);

      return result;
    } catch (error) {
      return error;
    }
  }
  async deleteArchivo_ById(id: string): Promise<void> {
    const archivo = await this.archivoRepository.findOne({ where: { id } });
    if (!archivo) throw new NotFoundException('Archivo no encontrado');
    const filePath = path.join(this.rutaCarpetaArchivos, archivo.filename);
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      throw new Error(`Error al eliminar el archivo: ${error.message}`);
    }

    try {
      await this.archivoRepository.remove(archivo);
    } catch (error) {
      throw new Error(
        `Error al eliminar el archivo de la base de datos: ${error.message}`,
      );
    }
  }
  async insertPerfil(
    input: CreateArchivoInput,
    persona_id: string,
  ): Promise<any> {
    try {
      const id = input.id || uuidv4();
      const archivo = new Archivo();
      archivo.id = id;
      archivo.filename = input.filename;
      archivo.originalname = input.originalname;
      const result = await this.archivoRepository.save(archivo);

      return result;
    } catch (error) {
      return error;
    }
  }
  async deletePerfil_ById(id: string): Promise<void> {
    const archivo = await this.archivoRepository.findOne({ where: { id } });
    if (!archivo) throw new NotFoundException('Archivo no encontrado');
    const filePath = path.join(this.rutaCarpetaPerfiles, archivo.filename);
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      throw new Error(`Error al eliminar el archivo: ${error.message}`);
    }
    try {
      await this.archivoRepository.remove(archivo);
    } catch (error) {
      throw new Error(
        `Error al eliminar el archivo de la base de datos: ${error.message}`,
      );
    }
  }
}
