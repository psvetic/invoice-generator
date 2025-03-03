import { Controller, Post, Get, Delete, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { InvoicesService } from './invoices.service';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './models/invoice.model';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  getAllInvoices(): Invoice[] {
    return this.invoicesService.getAllInvoices();
  }

  @Get(':invoiceNumber')
  getInvoice(@Param('invoiceNumber') invoiceNumber: string): Invoice | null {
    return this.invoicesService.getInvoice(Number(invoiceNumber));
  }

  @Post()
  createInvoice(@Body() createInvoiceDto: CreateInvoiceDto): Invoice {
    return this.invoicesService.createInvoice(createInvoiceDto);
  }

  @Delete(':invoiceNumber')
  deleteInvoice(@Param('invoiceNumber') invoiceNumber: string): { success: boolean } {
    const result = this.invoicesService.deleteInvoice(Number(invoiceNumber));
    return { success: result };
  }

  @Post('generate')
  async generateInvoice(
    @Body() generateInvoiceDto: GenerateInvoiceDto,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.invoicesService.generateInvoicePdf(
      generateInvoiceDto.invoiceNumber,
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=invoice-${generateInvoiceDto.invoiceNumber}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.status(HttpStatus.OK).send(pdfBuffer);
  }
}
