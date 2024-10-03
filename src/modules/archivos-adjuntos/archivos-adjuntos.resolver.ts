import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ArchivosAdjuntosService } from './archivos-adjuntos.service';
import { ArchivoAdjunto } from './entities/archivo-adjunto.entity';
import { ArchivoAdjuntoConArchivo } from './dto/archivo-adjunto-archivo.output';
import { TablasEntidades } from 'src/common/enums/entidades.enum';
import { Public } from 'src/common/decorators/public.decorator';
import { TipoAdjuntoEnum } from 'src/common/enums/archivo.enum';

@Resolver(() => ArchivoAdjunto)
export class ArchivosAdjuntosResolver {
  constructor(
    private readonly archivosAdjuntosService: ArchivosAdjuntosService,
  ) {}

  @Mutation(() => [ArchivoAdjunto])
  async saveFiles_DeRegistro(
    @Args('registro_id', { type: () => String }) registro_id: string,
    @Args('nombre_tabla') nombre_tabla: TablasEntidades,
    @Args('files_ids', { type: () => [String] }) files_ids: string[],
    @Context() context,
  ): Promise<ArchivoAdjunto[]> {
    return await this.archivosAdjuntosService.saveArchivosAdjuntos(
      nombre_tabla,
      registro_id,
      files_ids,
      context.req.user.sub,
    );
  }

  @Public()
  @Query(() => [ArchivoAdjunto])
  async getFiles_DeRegistro(
    @Args('nombre_tabla') nombre_tabla: TablasEntidades,
    @Args('registro_id', { type: () => String }) registro_id: string,
    @Context() context,
  ): Promise<ArchivoAdjunto[]> {
    return await this.archivosAdjuntosService.getArchivosAdjuntos_Registro(
      nombre_tabla,
      registro_id,
      context.req.user.sub,
    );
  }

  @Query(() => [ArchivoAdjuntoConArchivo])
  async getArchivosAdjuntos_ByRegistroId(
    @Args('registro_id') registro_id: string,
    @Args('nombre_tabla') nombre_tabla: TablasEntidades,
    @Args('tipo_adjunto')
    tipo_adjunto: TipoAdjuntoEnum = TipoAdjuntoEnum.DEFAULT,
  ): Promise<ArchivoAdjuntoConArchivo[]> {
    return await this.archivosAdjuntosService.getArchivosAdjuntos_ByRegistroId(
      registro_id,
      nombre_tabla,
      tipo_adjunto,
    );
  }
}
