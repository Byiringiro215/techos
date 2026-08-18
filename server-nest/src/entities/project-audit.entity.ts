import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { AuditTask } from './audit-task.entity';

@Entity('project_audits')
export class ProjectAudit {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  org_id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ default: 'needed' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  created_by: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => AuditTask, (task) => task.audit, { cascade: true })
  tasks: AuditTask[];
}
