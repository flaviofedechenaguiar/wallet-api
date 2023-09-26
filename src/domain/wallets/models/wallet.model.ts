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

@Entity({ name: 'wallets' })
export class SQLiteWalletEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description: string;

  @Column()
  slug: string;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  amount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => SQLiteUserEntity)
  @JoinColumn({ name: 'user_id' })
  user: SQLiteUserEntity;

  @Column({ nullable: false })
  user_id: number;
}
