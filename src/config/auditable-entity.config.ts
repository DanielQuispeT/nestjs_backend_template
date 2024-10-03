import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
} from 'typeorm';

@ObjectType()
@Entity()
export abstract class AuditableEntity extends BaseEntity {
  @CreateDateColumn({ type: 'timestamp' })
  @Field(() => Date, { nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Field(() => Date, { nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  @Field(() => Date, { nullable: true })
  deleted_at?: Date;
}
