import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ArchivosService } from './archivos.service';
import { Archivo } from './entities/archivo.entity';
import { Public } from 'src/common/decorators/public.decorator';
import { editFileName } from 'src/common/utils/archivo-uploading.utils';
import { Express } from 'express';

@Controller('archivos')
export class ArchivosController {
  constructor(private archivosService: ArchivosService) {}

  @Public()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/archivos',
        filename: editFileName,
      }),
    }),
  )
  @Post('upload_file')
  async uploadedFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const response = new Archivo();
    response.filename = file.filename;
    response.originalname = file.originalname;
    response.id = file.filename.split('+')[1].split('.')[0];
    let archivo_guardado = await this.archivosService.insertArchivo(
      response,
      req.user.sub,
    );
    return archivo_guardado;
  }

  @Public()
  @Delete('delete_file/:id')
  async deleteFile(@Param('id') id: string, @Req() req) {
    let archivo_eliminado = await this.archivosService.deleteArchivo_ById(id);
    return archivo_eliminado;
  }

  @Public()
  @Get(':filepath')
  async seeUploadedFile(@Param('filepath') image, @Res() res) {
    return res.sendFile(image, { root: './files/archivos' });
  }

  //PERFIL
  @Public()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/perfiles',
        filename: editFileName,
      }),
    }),
  )
  @Post('upload_perfil')
  async uploadedFilePerfil(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const response = new Archivo();
    response.filename = file.filename;
    response.originalname = file.originalname;
    response.id = file.filename.split('+')[1].split('.')[0];
    let archivo_guardado = await this.archivosService.insertPerfil(
      response,
      req.user.sub,
    );
    return archivo_guardado;
  }

  @Public()
  @Delete('delete_perfil/:id')
  async deleteFilePerfil(@Param('id') id: string, @Req() req) {
    let archivo_eliminado = await this.archivosService.deletePerfil_ById(id);
    return archivo_eliminado;
  }

  @Public()
  @Get('perfil/:filepath')
  async seeUploadedFilePerfil(@Param('filepath') image, @Res() res) {
    return res.sendFile(image, { root: './files/perfiles' });
  }

  @Public()
  @Get('public/:filepath')
  async seeUploadedFilePublic(@Param('filepath') image, @Res() res) {
    return res.sendFile(image, { root: './files/public_media' });
  }

  // @Public()
  // @Get('recibo-transaccion/:transaccion_id')
  // async downloadFile(
  //   @Param('transaccion_id') transaccion_id: string,
  //   @Res() res: Response,
  // ) {
  //   const file =
  //     await this.archivosService.getArchivoReciboTransaccion_ByRegistroId_ByNombreTabla(
  //       transaccion_id,
  //       TablasEntidades.TRANSACCIONES,
  //       TipoAdjuntoEnum.RECIBO_TRANSACCION,
  //     );

  //   if (!file) {
  //     throw new HttpException('File not found', HttpStatus.NOT_FOUND);
  //   }

  //   res.set({
  //     'Content-Disposition': `attachment; filename="${file.originalname}"`,
  //     'Content-Type': 'application/pdf',
  //   });

  //   const root = './files/archivos';
  //   res.sendFile(file.filename, { root });
  // }
}
