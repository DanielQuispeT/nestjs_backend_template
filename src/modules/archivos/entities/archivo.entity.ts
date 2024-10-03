import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { AuditableEntity } from 'src/config/auditable-entity.config';
import { ArchivoAdjunto } from 'src/modules/archivos-adjuntos/entities/archivo-adjunto.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'archivos' })
export class Archivo extends AuditableEntity {
  @IsUUID()
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  filename: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  originalname: string;

  @Field((type) => [ArchivoAdjunto])
  @OneToMany(
    (type) => ArchivoAdjunto,
    (archivo_adjunto) => archivo_adjunto.archivo,
  )
  archivos_adjuntos: Promise<ArchivoAdjunto[]>;
}
