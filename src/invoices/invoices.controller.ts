import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { InvoicesService } from './invoices.service';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

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