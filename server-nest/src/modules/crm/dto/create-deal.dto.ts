import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CreateDealDto {
  @IsOptional()
  @IsString()
  contact_id?: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsEnum(['qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'])
  stage?: string;

  @IsOptional()
  @IsNumber()
  probability?: number;

  @IsOptional()
  @IsString()
  expected_close_date?: string;

  @IsOptional()
  @IsString()
  assigned_to?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
