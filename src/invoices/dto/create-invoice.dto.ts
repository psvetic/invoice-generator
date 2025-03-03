import { IsNotEmpty, IsNumber, IsString, ValidateNested, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

class CompanyDetailsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}

class ClientDetailsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  city: string;
}

class InvoiceItemDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  item: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;
}

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  invoiceNumber: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CompanyDetailsDto)
  companyDetails: CompanyDetailsDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ClientDetailsDto)
  clientDetails: ClientDetailsDto;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => InvoiceItemDto)
  items: InvoiceItemDto[];
}