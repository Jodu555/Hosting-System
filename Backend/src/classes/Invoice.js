const fs = require("fs");
const PDFDocument = require("pdfkit");


class Invoice {
    constructor(invoice, path) {
        this.invoice = invoice;
        this.path = path;
    }

    create() {
        this.doc = new PDFDocument({ size: "A4", margin: 50 });

        this.generateHeader(doc);
        this.generateCustomerInformation(doc, invoice);
        this.generateInvoiceTable(doc, invoice);
        this.generateFooter(doc);

        doc.end();
        doc.pipe(fs.createWriteStream(path));
    }

    generateHeader(doc) {
        doc
            .image("logo.png", 50, 45, { width: 50 })
            .fillColor("#444444")
            .fontSize(20)
            .text("Jodu Inc.", 110, 57)
            .fontSize(10)
            .text("Jodu Inc.", 200, 50, { align: "right" })
            .text("Luisenstr 11", 200, 65, { align: "right" })
            .text("Bruchsal, DE, 76646", 200, 80, { align: "right" })
            .moveDown();
    }

    generateCustomerInformation(doc, invoice) {
        doc
            .fillColor("#444444")
            .fontSize(20)
            .text("Invoice", 50, 160);

        generateHr(doc, 185);

        const customerInformationTop = 200;

        doc
            .fontSize(10)
            .text("Invoice Number:", 50, customerInformationTop)
            .font("Helvetica-Bold")
            .text(invoice.invoice_nr, 150, customerInformationTop)
            .font("Helvetica")
            .text("Invoice Date:", 50, customerInformationTop + 15)
            .text(formatDate(new Date()), 150, customerInformationTop + 15)
            .text("Balance Due:", 50, customerInformationTop + 30)
            .text(
                formatCurrency(invoice.subtotal),
                150,
                customerInformationTop + 30
            )

            .font("Helvetica-Bold")
            .text(invoice.shipping.name, 300, customerInformationTop)
            .font("Helvetica")
            .text(invoice.shipping.address, 300, customerInformationTop + 15)
            .text(
                invoice.shipping.city +
                ", " +
                invoice.shipping.state +
                ", " +
                invoice.shipping.country,
                300,
                customerInformationTop + 30
            )
            .moveDown();

        generateHr(doc, 252);
    }

    generateInvoiceTable(doc, invoice) {
        let i;
        const invoiceTableTop = 330;

        doc.font("Helvetica-Bold");
        generateTableRow(
            doc,
            invoiceTableTop,
            "Item",
            "Description",
            "Unit Cost",
            "Quantity",
            "Line Total"
        );
        generateHr(doc, invoiceTableTop + 20);
        doc.font("Helvetica");

        for (i = 0; i < invoice.items.length; i++) {
            const item = invoice.items[i];
            const position = invoiceTableTop + (i + 1) * 30;
            generateTableRow(
                doc,
                position,
                item.item,
                item.description,
                formatCurrency(item.amount / item.quantity),
                item.quantity,
                formatCurrency(item.amount)
            );

            generateHr(doc, position + 20);
        }

        const subtotalPosition = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            subtotalPosition,
            "",
            "",
            "Subtotal",
            "",
            formatCurrency(invoice.subtotal)
        );

        const paidToDatePosition = subtotalPosition + 20;
        generateTableRow(
            doc,
            paidToDatePosition,
            "",
            "",
            "16.00% Mwst",
            "",
            formatCurrency(invoice.mwst)
        );

        const duePosition = paidToDatePosition + 25;
        doc.font("Helvetica-Bold");
        generateTableRow(
            doc,
            duePosition,
            "",
            "",
            "Balance Due",
            "",
            formatCurrency(invoice.total)
        );
        doc.font("Helvetica");
    }

    generateFooter(doc) {
        doc
            .fontSize(10)
            .text(
                "All Rights Reserved to Jodu Inc.",
                50,
                780,
                { align: "center", width: 500 }
            );
    }

    generateTableRow(
        doc,
        y,
        item,
        description,
        unitCost,
        quantity,
        lineTotal
    ) {
        doc
            .fontSize(10)
            .text(item, 50, y)
            .text(description, 150, y)
            .text(unitCost, 280, y, { width: 90, align: "right" })
            .text(quantity, 370, y, { width: 90, align: "right" })
            .text(lineTotal, 0, y, { align: "right" });
    }

    generateHr(doc, y) {
        doc
            .strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(50, y)
            .lineTo(550, y)
            .stroke();
    }

    formatCurrency(cents) {
        return "€" + (cents / 100).toFixed(2);
    }

    formatDate(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return year + "/" + month + "/" + day;
    }

}



module.exports = {
    createInvoice
};