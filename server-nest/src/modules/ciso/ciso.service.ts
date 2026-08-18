import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { ProjectAudit } from '../../entities/project-audit.entity';
import { AuditTask } from '../../entities/audit-task.entity';
import { Report } from '../../entities/report.entity';
import { CreateProjectAuditDto } from './dto/create-project-audit.dto';
import { UpdateProjectAuditDto } from './dto/update-project-audit.dto';
import { CreateAuditTaskDto } from './dto/create-audit-task.dto';
import { UpdateAuditTaskDto } from './dto/update-audit-task.dto';

@Injectable()
export class CisoService {
  constructor(
    @InjectRepository(ProjectAudit)
    private auditsRepository: Repository<ProjectAudit>,
    @InjectRepository(AuditTask)
    private auditTasksRepository: Repository<AuditTask>,
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  private mapAudit(audit: ProjectAudit, taskCount = 0) {
    return {
      ...audit,
      task_count: taskCount,
    };
  }

  private mapTask(task: AuditTask) {
    return {
      ...task,
      finished: task.status === 'done',
      audit_name: task.audit?.name || null,
    };
  }

  async createAudit(org_id: string, user_id: string, dto: CreateProjectAuditDto) {
    const audit = this.auditsRepository.create({
      id: randomUUID(),
      org_id,
      name: dto.name.trim(),
      description: dto.description?.trim() || null,
      status: dto.status || 'needed',
      created_by: user_id,
    });
    await this.auditsRepository.save(audit);
    return { success: true, data: this.mapAudit(audit, 0) };
  }

  async getAudits(org_id: string, status?: 'needed' | 'in_progress' | 'completed') {
    const where: any = { org_id };
    if (status) where.status = status;
    const audits = await this.auditsRepository.find({
      where,
      order: { updated_at: 'DESC' },
      relations: ['tasks'],
    });
    return {
      success: true,
      data: audits.map((audit) => this.mapAudit(audit, audit.tasks?.length || 0)),
    };
  }

  async getAudit(org_id: string, id: string) {
    const audit = await this.auditsRepository.findOne({
      where: { id, org_id },
      relations: ['tasks'],
    });
    if (!audit) throw new NotFoundException('Project audit not found');
    return { success: true, data: this.mapAudit(audit, audit.tasks?.length || 0) };
  }

  async updateAudit(org_id: string, id: string, dto: UpdateProjectAuditDto) {
    const audit = await this.auditsRepository.findOne({
      where: { id, org_id },
      relations: ['tasks'],
    });
    if (!audit) throw new NotFoundException('Project audit not found');
    if (dto.name !== undefined) audit.name = dto.name.trim();
    if (dto.description !== undefined) audit.description = dto.description.trim() || null;
    if (dto.status !== undefined) audit.status = dto.status;
    await this.auditsRepository.save(audit);
    return { success: true, data: this.mapAudit(audit, audit.tasks?.length || 0) };
  }

  async deleteAudit(org_id: string, id: string) {
    const audit = await this.auditsRepository.findOne({ where: { id, org_id } });
    if (!audit) throw new NotFoundException('Project audit not found');
    await this.auditsRepository.remove(audit);
    return { success: true, message: 'Project audit deleted' };
  }

  async createAuditTask(org_id: string, user_id: string, dto: CreateAuditTaskDto) {
    const audit = await this.auditsRepository.findOne({
      where: { id: dto.project_audit_id, org_id },
    });
    if (!audit) throw new BadRequestException('Select a valid project audit');

    const task = this.auditTasksRepository.create({
      id: randomUUID(),
      org_id,
      project_audit_id: dto.project_audit_id,
      title: dto.title.trim(),
      description: dto.description?.trim() || null,
      status: dto.status || 'todo',
      priority: dto.priority || 'medium',
      created_by: user_id,
    });
    await this.auditTasksRepository.save(task);
    task.audit = audit;
    return { success: true, data: this.mapTask(task) };
  }

  async getAuditTasks(
    org_id: string,
    filters?: { project_audit_id?: string; status?: 'finished' | 'not_finished' },
  ) {
    const where: any = { org_id };
    if (filters?.project_audit_id) where.project_audit_id = filters.project_audit_id;

    const tasks = await this.auditTasksRepository.find({
      where,
      order: { created_at: 'DESC' },
      relations: ['audit'],
    });

    const filtered = tasks.filter((task) => {
      if (filters?.status === 'finished') return task.status === 'done';
      if (filters?.status === 'not_finished') return task.status !== 'done';
      return true;
    });

    return { success: true, data: filtered.map((task) => this.mapTask(task)) };
  }

  async updateAuditTask(org_id: string, id: string, dto: UpdateAuditTaskDto) {
    const task = await this.auditTasksRepository.findOne({
      where: { id, org_id },
      relations: ['audit'],
    });
    if (!task) throw new NotFoundException('Audit task not found');

    if (dto.project_audit_id && dto.project_audit_id !== task.project_audit_id) {
      const audit = await this.auditsRepository.findOne({
        where: { id: dto.project_audit_id, org_id },
      });
      if (!audit) throw new BadRequestException('Select a valid project audit');
      task.project_audit_id = dto.project_audit_id;
      task.audit = audit;
    }
    if (dto.title !== undefined) task.title = dto.title.trim();
    if (dto.description !== undefined) task.description = dto.description.trim() || null;
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.priority !== undefined) task.priority = dto.priority;

    await this.auditTasksRepository.save(task);
    return { success: true, data: this.mapTask(task) };
  }

  async updateAuditTaskStatus(org_id: string, id: string, finished: boolean) {
    return this.updateAuditTask(org_id, id, { status: finished ? 'done' : 'todo' });
  }

  async deleteAuditTask(org_id: string, id: string) {
    const task = await this.auditTasksRepository.findOne({ where: { id, org_id } });
    if (!task) throw new NotFoundException('Audit task not found');
    await this.auditTasksRepository.remove(task);
    return { success: true, message: 'Audit task deleted' };
  }

  async getReports(org_id: string) {
    const reports = await this.reportsRepository.find({
      where: { org_id },
      order: { created_at: 'DESC' },
    });
    const filtered = reports.filter((report) =>
      ['security', 'audit', 'compliance', 'risk'].includes((report.type || '').toLowerCase()),
    );
    return { success: true, data: filtered };
  }

  async createReport(org_id: string, user_id: string, payload: { title: string; summary?: string; type?: string }) {
    const report = this.reportsRepository.create({
      id: randomUUID(),
      org_id,
      created_by: user_id,
      title: payload.title,
      type: payload.type || 'security',
      config: { source: 'ciso_portal' },
      data: {
        summary: payload.summary || 'Security report drafted from CISO portal',
      },
      scheduled: null as any,
    });

    await this.reportsRepository.save(report);
    return { success: true, data: report };
  }
}
