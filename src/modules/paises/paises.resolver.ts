import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PaisesService } from './paises.service';
import { Pais } from './entities/pais.entity';
import { InsertPaisInput } from './dto/insert-pais.input';
import { UpdatePaisInput } from './dto/update-pais.input';

@Resolver(() => Pais)
export class PaisesResolver {
  constructor(private readonly paisesService: PaisesService) {}

  @Query(() => [Pais])
  async getAllPaises(): Promise<Pais[]> {
    return await this.paisesService.getAllPaises();
  }

  @Query(() => Pais, { nullable: true })
  async getPais_ByName(@Args('name') name: string): Promise<Pais | null> {
    return await this.paisesService.getPais_ByName(name);
  }
}
