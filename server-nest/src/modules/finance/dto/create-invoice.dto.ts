import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateInvoiceDto {
  @IsOptional()
  @IsString()
  contact_id?: string;

  @IsNotEmpty()
  @IsString()
  invoice_number: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  tax?: number;

  @IsNotEmpty()
  @IsNumber()
  total: number;

  @IsNotEmpty()
  @IsString()
  due_date: string;

  @IsNotEmpty()
  @IsString()
  issued_date: string;

  @IsNotEmpty()
  @IsArray()
  items: any[];

  @IsOptional()
  @IsString()
  notes?: string;
}
