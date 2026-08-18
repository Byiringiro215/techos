import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProjectAuditDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['needed', 'in_progress', 'completed'])
  status?: 'needed' | 'in_progress' | 'completed';
}
