"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var pdfkit_1 = require("pdfkit");
var generateInvoicePdf = function (invoiceNumber) {
    return new Promise(function (resolve) {
        // Create a new PDF document
        var doc = new pdfkit_1.default({ margin: 50 });
        var buffers = [];
        // Handle document creation
        doc.on('data', function (buffer) { return buffers.push(buffer); });
        doc.on('end', function () {
            var pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
        // Create the invoice
        generateInvoiceContent(doc, invoiceNumber);
        // Finalize the PDF
        doc.end();
    });
};
var generateInvoiceContent = function (doc, invoiceNumber) {
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
        .text("Invoice Number: ".concat(invoiceNumber), { align: 'left' })
        .text("Date: ".concat(new Date().toLocaleDateString()), { align: 'left' })
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
    var startX = 50;
    var startY = doc.y;
    var itemX = startX;
    var descriptionX = startX + 50;
    var quantityX = startX + 280;
    var priceX = startX + 350;
    var amountX = startX + 450;
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
    var items = [
        { item: 1, description: 'Service 1', quantity: 1, price: 100, amount: 100 },
        { item: 2, description: 'Service 2', quantity: 2, price: 50, amount: 100 },
        { item: 3, description: 'Service 3', quantity: 1, price: 75, amount: 75 },
    ];
    var currentY = doc.y;
    var lineHeight = 20;
    items.forEach(function (item) {
        currentY += lineHeight;
        doc
            .font('Helvetica')
            .text(item.item.toString(), itemX, currentY)
            .text(item.description, descriptionX, currentY)
            .text(item.quantity.toString(), quantityX, currentY)
            .text("$".concat(item.price.toFixed(2)), priceX, currentY)
            .text("$".concat(item.amount.toFixed(2)), amountX, currentY);
    });
    // Draw a line below items
    currentY += lineHeight;
    doc
        .moveTo(startX, currentY)
        .lineTo(startX + 500, currentY)
        .stroke();
    // Total amount
    var total = items.reduce(function (sum, item) { return sum + item.amount; }, 0);
    currentY += lineHeight;
    doc
        .font('Helvetica-Bold')
        .text('Total:', priceX, currentY)
        .text("$".concat(total.toFixed(2)), amountX, currentY);
    // Footer
    doc
        .font('Helvetica')
        .fontSize(10)
        .text('Thank you for your business!', 50, doc.page.height - 100, {
        align: 'center',
    });
};
// Command line script to generate an invoice
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var invoiceNumber, pdfBuffer, uploadsDir, filePath, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                invoiceNumber = process.argv[2] ? parseInt(process.argv[2], 10) : 1001;
                if (isNaN(invoiceNumber)) {
                    console.error('Please provide a valid invoice number as a command line argument');
                    process.exit(1);
                }
                console.log("Generating invoice #".concat(invoiceNumber, "..."));
                return [4 /*yield*/, generateInvoicePdf(invoiceNumber)];
            case 1:
                pdfBuffer = _a.sent();
                uploadsDir = path.join(__dirname, '..', 'uploads');
                if (!fs.existsSync(uploadsDir)) {
                    fs.mkdirSync(uploadsDir, { recursive: true });
                }
                filePath = path.join(uploadsDir, "invoice-".concat(invoiceNumber, ".pdf"));
                fs.writeFileSync(filePath, pdfBuffer);
                console.log("PDF invoice created successfully at ".concat(filePath));
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Error generating PDF:', error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// Run the script if it's called directly
if (require.main === module) {
    run();
}
