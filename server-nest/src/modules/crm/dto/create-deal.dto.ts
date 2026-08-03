import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CreateDealDto {
  @IsNotEmpty()
  @IsString()
  contact_id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;

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

  @IsNotEmpty()
  @IsString()
  assigned_to: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
