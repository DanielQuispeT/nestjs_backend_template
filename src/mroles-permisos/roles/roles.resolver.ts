import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { InsertRolInput } from './dto/insert-rol.input';
import { Rol } from './entities/rol.entity';
import { RolesService } from './roles.service';
import { UpdateRolInput } from './dto/update-rol.input';

@Resolver()
export class RolesResolver {
  constructor(private readonly rolService: RolesService) {}

  @Query(() => [Rol])
  async getRoles(): Promise<Rol[]> {
    return await this.rolService.getRoles();
  }

  @Query(() => Rol)
  async getRol_ById(@Args('id') id: string): Promise<Rol> {
    return await this.rolService.getRol_ById(id);
  }

  @Mutation(() => Rol)
  async insertRol(@Args('data') data: InsertRolInput): Promise<Rol> {
    return await this.rolService.insert(data);
  }

  @Mutation(() => Rol)
  async updateRol(@Args('data') data: UpdateRolInput): Promise<Rol> {
    return await this.rolService.update(data);
  }

  @Mutation(() => Boolean)
  async deleteRol(@Args('id') id: string): Promise<boolean> {
    return await this.rolService.delete(id);
  }
}
