import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateInvoiceDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  invoiceNumber: number;
}