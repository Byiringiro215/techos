import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsString()
  client_name?: string;
}
