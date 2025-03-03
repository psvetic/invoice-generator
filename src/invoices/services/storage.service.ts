import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Invoice } from '../models/invoice.model';

@Injectable()
export class StorageService {
  private readonly dataDir: string;
  private readonly invoicesFile: string;
  private invoices: Record<number, Invoice> = {};

  constructor() {
    this.dataDir = path.join(process.cwd(), 'uploads');
    this.invoicesFile = path.join(this.dataDir, 'invoices.json');
    this.ensureDirectoryExists();
    this.loadInvoices();
  }

  private ensureDirectoryExists(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private loadInvoices(): void {
    try {
      if (fs.existsSync(this.invoicesFile)) {
        const data = fs.readFileSync(this.invoicesFile, 'utf8');
        this.invoices = JSON.parse(data);
      } else {
        // Create the file if it doesn't exist
        this.saveInvoices();
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
      this.invoices = {};
    }
  }

  private saveInvoices(): void {
    try {
      fs.writeFileSync(this.invoicesFile, JSON.stringify(this.invoices, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving invoices:', error);
    }
  }

  saveInvoice(invoice: Invoice): void {
    this.invoices[invoice.invoiceNumber] = invoice;
    this.saveInvoices();
  }

  getInvoice(invoiceNumber: number): Invoice | null {
    return this.invoices[invoiceNumber] || null;
  }

  getAllInvoices(): Invoice[] {
    return Object.values(this.invoices).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  deleteInvoice(invoiceNumber: number): boolean {
    if (this.invoices[invoiceNumber]) {
      delete this.invoices[invoiceNumber];
      this.saveInvoices();
      return true;
    }
    return false;
  }
}