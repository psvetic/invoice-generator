import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';

const generateInvoicePdf = (invoiceNumber: number): Promise<Buffer> => {
  return new Promise((resolve) => {
    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    // Handle document creation
    doc.on('data', (buffer: Buffer) => buffers.push(buffer));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });

    // Create the invoice
    generateInvoiceContent(doc, invoiceNumber);

    // Finalize the PDF
    doc.end();
  });
};

const generateInvoiceContent = (doc: PDFKit.PDFDocument, invoiceNumber: number) => {
  // Add document title
  doc
    .font('Helvetica-Bold')
    .fontSize(20)
    .text('INVOICE', { align: 'center' })
    .moveDown();

  // Add invoice number and date
  doc
    .font('Helvetica')
    .fontSize(12)
    .text(`Invoice Number: ${invoiceNumber}`, { align: 'left' })
    .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' })
    .moveDown(2);

  // Company details
  doc
    .font('Helvetica-Bold')
    .text('Company Name', { align: 'left' })
    .font('Helvetica')
    .text('123 Business Street')
    .text('Business City, 12345')
    .text('Email: contact@company.com')
    .text('Phone: (123) 456-7890')
    .moveDown(2);

  // Client details
  doc
    .font('Helvetica-Bold')
    .text('Billed To:', { align: 'left' })
    .font('Helvetica')
    .text('Client Name')
    .text('456 Client Street')
    .text('Client City, 54321')
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

  // Sample data rows
  const items = [
    { item: 1, description: 'Service 1', quantity: 1, price: 100, amount: 100 },
    { item: 2, description: 'Service 2', quantity: 2, price: 50, amount: 100 },
    { item: 3, description: 'Service 3', quantity: 1, price: 75, amount: 75 },
  ];

  let currentY = doc.y;
  const lineHeight = 20;

  items.forEach((item) => {
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
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  currentY += lineHeight;
  doc
    .font('Helvetica-Bold')
    .text('Total:', priceX, currentY)
    .text(`$${total.toFixed(2)}`, amountX, currentY);

  // Footer
  doc
    .font('Helvetica')
    .fontSize(10)
    .text('Thank you for your business!', 50, doc.page.height - 100, {
      align: 'center',
    });
};

// Command line script to generate an invoice
const run = async () => {
  try {
    const invoiceNumber = process.argv[2] ? parseInt(process.argv[2], 10) : 1001;
    
    if (isNaN(invoiceNumber)) {
      console.error('Please provide a valid invoice number as a command line argument');
      process.exit(1);
    }
    
    console.log(`Generating invoice #${invoiceNumber}...`);
    const pdfBuffer = await generateInvoicePdf(invoiceNumber);
    
    // Make sure the uploads directory exists
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Write the PDF to a file
    const filePath = path.join(uploadsDir, `invoice-${invoiceNumber}.pdf`);
    fs.writeFileSync(filePath, pdfBuffer);
    
    console.log(`PDF invoice created successfully at ${filePath}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

// Run the script if it's called directly
if (require.main === module) {
  run();
}