import { SQLiteUserEntity } from 'src/domain/users/models/user.model';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IconEntity } from './icon.model';

@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description: string;

  @Column()
  slug: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => SQLiteUserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: SQLiteUserEntity;

  @Column({ nullable: false })
  user_id: number;

  @ManyToOne(() => IconEntity)
  @JoinColumn({ name: 'icon_id' })
  icon: IconEntity;

  @Column({ nullable: false })
  icon_id: number;
}
