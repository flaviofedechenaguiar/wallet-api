import { CategoryEntity } from 'src/domain/categories/models/category.model';
import { PiggyBankEntity } from 'src/domain/piggy-bank/models/piggy-bank.model';
import { SQLiteWalletEntity } from 'src/domain/wallets/models/wallet.model';
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

@Entity({ name: 'transactions' })
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description: string;

  @Column()
  date: Date;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  amount: number;

  @Column()
  status: string;

  @Column('uuid')
  transaction_code: string;

  @Column({ nullable: true })
  note?: string;

  @ManyToOne(() => SQLiteWalletEntity)
  @JoinColumn({ name: 'wallet_id' })
  wallet: SQLiteWalletEntity;

  @Column({ nullable: true })
  wallet_id: number;

  @ManyToOne(() => PiggyBankEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'piggy_bank_id' })
  piggy_bank: PiggyBankEntity;

  @Column({ nullable: true })
  piggy_bank_id: number;

  @Column('boolean', { default: true })
  canUpdate?: boolean;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'category_id' })
  category: SQLiteWalletEntity;

  @Column({ nullable: false })
  category_id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
