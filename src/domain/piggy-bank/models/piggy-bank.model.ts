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

@Entity({ name: 'piggy_banks' })
export class PiggyBankEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;

  @Column()
  final_date: Date;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  amount: number;

  @ManyToOne(() => SQLiteUserEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: SQLiteUserEntity;

  @Column({ nullable: false })
  user_id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
