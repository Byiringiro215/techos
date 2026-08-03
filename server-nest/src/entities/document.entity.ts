import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('documents')
export class Document {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  org_id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 'general' })
  type: string;

  @Column({ nullable: true })
  folder: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column()
  created_by: string;

  @Column({ default: 1 })
  version: number;

  @Column({ default: false })
  is_archived: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
