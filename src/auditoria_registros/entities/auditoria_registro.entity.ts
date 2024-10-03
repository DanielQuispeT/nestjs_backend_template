import { ObjectType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { TablasEntidades } from 'src/common/enums/entidades.enum';
import { AuditableEntity } from 'src/config/auditable-entity.config';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'auditoria_registros' })
@ObjectType()
export class AuditoriaRegistro extends AuditableEntity {
  @IsUUID()
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => TablasEntidades)
  @Column({
    type: 'enum',
    enum: TablasEntidades,
    nullable: false,
  })
  @IsNotEmpty()
  entidad_nombre: TablasEntidades;

  @Field(() => String)
  @Column()
  @IsNotEmpty()
  entidad_id: string;

  @Field(() => String)
  @Column()
  @IsNotEmpty()
  accion: string;

  @Field(() => String)
  @Column()
  @IsNotEmpty()
  persona_id: string;

  @Field(() => String, { nullable: true })
  @Column('mediumtext', { nullable: true })
  datos_anteriores: any;

  @Field(() => String, { nullable: true })
  @Column('mediumtext', { nullable: true })
  datos_nuevos: any;
}
