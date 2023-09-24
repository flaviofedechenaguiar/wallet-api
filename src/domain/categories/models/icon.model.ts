import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'icons' })
export class IconEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description: string;

  @Column()
  data: string;
}
