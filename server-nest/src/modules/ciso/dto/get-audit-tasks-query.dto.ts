import { IsIn, IsOptional, IsUUID } from 'class-validator';

export class GetAuditTasksQueryDto {
  @IsOptional()
  @IsUUID()
  project_audit_id?: string;

  @IsOptional()
  @IsIn(['finished', 'not_finished'])
  status?: 'finished' | 'not_finished';
}
