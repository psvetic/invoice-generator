export interface InvoiceItem {
  item: number;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface Invoice {
  invoiceNumber: number;
  createdAt: string;
  companyDetails: {
    name: string;
    address: string;
    city: string;
    email: string;
    phone: string;
  };
  clientDetails: {
    name: string;
    address: string;
    city: string;
  };
  items: InvoiceItem[];
  total: number;
}