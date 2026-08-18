import { IsIn, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateAuditTaskDto {
  @IsUUID()
  project_audit_id: string;

  @IsString()
  @MinLength(2)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['todo', 'in_progress', 'done'])
  status?: 'todo' | 'in_progress' | 'done';

  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'critical'])
  priority?: 'low' | 'medium' | 'high' | 'critical';
}
