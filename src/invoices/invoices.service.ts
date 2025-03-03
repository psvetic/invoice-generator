import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as PDFKit from 'pdfkit';
import { Invoice, InvoiceItem } from './models/invoice.model';
import { StorageService } from './services/storage.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly storageService: StorageService) {}

  async generateInvoicePdf(invoiceNumber: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        // Create a new PDF document
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        // Handle document creation
        doc.on('data', (buffer: Buffer) => buffers.push(buffer));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });
        doc.on('error', (err: Error) => {
          reject(new Error(`PDF generation error: ${err.message}`));
        });

        // Create the invoice
        this.generateInvoiceContent(doc, invoiceNumber);

        // Finalize the PDF
        doc.end();
      } catch (error) {
        reject(
          new Error(
            `Failed to generate PDF: ${error instanceof Error ? error.message : String(error)}`,
          ),
        );
      }
    });
  }

  // Create a new invoice from DTO
  createInvoice(createInvoiceDto: CreateInvoiceDto): Invoice {
    const total = createInvoiceDto.items.reduce((sum, item) => sum + item.amount, 0);
    
    const newInvoice: Invoice = {
      ...createInvoiceDto,
      createdAt: new Date().toISOString(),
      total,
    };
    
    // Save the invoice
    this.storageService.saveInvoice(newInvoice);
    return newInvoice;
  }
  
  // Get or create an invoice object
  getOrCreateInvoice(invoiceNumber: number): Invoice {
    // Check if the invoice already exists
    const existingInvoice = this.storageService.getInvoice(invoiceNumber);
    if (existingInvoice) {
      return existingInvoice;
    }

    // Sample data for a new invoice
    const items: InvoiceItem[] = [
      {
        item: 1,
        description: 'Service 1',
        quantity: 1,
        price: 100,
        amount: 100,
      },
      {
        item: 2,
        description: 'Service 2',
        quantity: 2,
        price: 50,
        amount: 100,
      },
      { item: 3, description: 'Service 3', quantity: 1, price: 75, amount: 75 },
    ];

    const total = items.reduce((sum, item) => sum + item.amount, 0);

    // Create a new invoice
    const newInvoice: Invoice = {
      invoiceNumber,
      createdAt: new Date().toISOString(),
      companyDetails: {
        name: 'Company Name',
        address: '123 Business Street',
        city: 'Business City, 12345',
        email: 'contact@company.com',
        phone: '(123) 456-7890',
      },
      clientDetails: {
        name: 'Client Name',
        address: '456 Client Street',
        city: 'Client City, 54321',
      },
      items,
      total,
    };

    // Save the invoice
    this.storageService.saveInvoice(newInvoice);
    return newInvoice;
  }

  // Get all invoices
  getAllInvoices(): Invoice[] {
    return this.storageService.getAllInvoices();
  }

  // Get a specific invoice
  getInvoice(invoiceNumber: number): Invoice | null {
    return this.storageService.getInvoice(invoiceNumber);
  }

  // Delete an invoice
  deleteInvoice(invoiceNumber: number): boolean {
    return this.storageService.deleteInvoice(invoiceNumber);
  }

  private generateInvoiceContent(
    doc: any,
    invoiceNumber: number,
  ) {
    // Get or create invoice data
    const invoice = this.getOrCreateInvoice(invoiceNumber);
    
    // Add document title
    doc
      .font('Helvetica-Bold')
      .fontSize(20)
      .text('INVOICE', { align: 'center' })
      .moveDown();

    // Add invoice number and date
    const createdDate = new Date(invoice.createdAt).toLocaleDateString();
    doc
      .font('Helvetica')
      .fontSize(12)
      .text(`Invoice Number: ${invoice.invoiceNumber}`, { align: 'left' })
      .text(`Date: ${createdDate}`, { align: 'left' })
      .moveDown(2);

    // Company details
    doc
      .font('Helvetica-Bold')
      .text(invoice.companyDetails.name, { align: 'left' })
      .font('Helvetica')
      .text(invoice.companyDetails.address)
      .text(invoice.companyDetails.city)
      .text(`Email: ${invoice.companyDetails.email}`)
      .text(`Phone: ${invoice.companyDetails.phone}`)
      .moveDown(2);

    // Client details
    doc
      .font('Helvetica-Bold')
      .text('Billed To:', { align: 'left' })
      .font('Helvetica')
      .text(invoice.clientDetails.name)
      .text(invoice.clientDetails.address)
      .text(invoice.clientDetails.city)
      .moveDown(2);

    // Table headers
    const startX = 50;
    const startY = doc.y;
    const itemX = startX;
    const descriptionX = startX + 50;
    const quantityX = startX + 280;
    const priceX = startX + 350;
    const amountX = startX + 450;

    doc
      .font('Helvetica-Bold')
      .text('Item', itemX, startY)
      .text('Description', descriptionX, startY)
      .text('Qty', quantityX, startY)
      .text('Price', priceX, startY)
      .text('Amount', amountX, startY)
      .moveDown();

    // Draw a line below headers
    doc
      .moveTo(startX, doc.y)
      .lineTo(startX + 500, doc.y)
      .stroke();

    let currentY = doc.y;
    const lineHeight = 20;

    invoice.items.forEach((item) => {
      currentY += lineHeight;

      doc
        .font('Helvetica')
        .text(item.item.toString(), itemX, currentY)
        .text(item.description, descriptionX, currentY)
        .text(item.quantity.toString(), quantityX, currentY)
        .text(`$${item.price.toFixed(2)}`, priceX, currentY)
        .text(`$${item.amount.toFixed(2)}`, amountX, currentY);
    });

    // Draw a line below items
    currentY += lineHeight;
    doc
      .moveTo(startX, currentY)
      .lineTo(startX + 500, currentY)
      .stroke();

    // Total amount
    currentY += lineHeight;
    doc
      .font('Helvetica-Bold')
      .text('Total:', priceX, currentY)
      .text(`$${invoice.total.toFixed(2)}`, amountX, currentY);

    // Footer
    doc
      .font('Helvetica')
      .fontSize(10)
      .text('Thank you for your business!', 50, doc.page.height - 100, {
        align: 'center',
      });
  }
}
