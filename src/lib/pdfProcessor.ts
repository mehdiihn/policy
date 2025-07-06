import { jsPDF } from "jspdf";
import * as fs from "fs";
import * as path from "path";

interface PolicyData {
  _id: string;
  policyNumber: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    address?: string;
    dateOfBirth?: string;
  };
  price: number;
  status: string;
  startDate: string;
  endDate: string;
  documentGeneratedAt: string;
  vehicleInfo: {
    make: string;
    model: string;
    colour: string;
    yearOfManufacture: number;
    vehicleRegistration?: string;
    registeredKeeper?: string;
    [key: string]: any;
  };
  createdBy: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export class PdfProcessor {
  private logoPath: string;
  private signaturePath: string;

  constructor() {
    this.logoPath = path.join(process.cwd(), "public", "logo.jpg");
    this.signaturePath = path.join(process.cwd(), "public", "sig.png");
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  private checkPageBreak(
    doc: jsPDF,
    yPos: number,
    requiredSpace: number = 20
  ): number {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (yPos + requiredSpace > pageHeight - 20) {
      doc.addPage();
      return 20; // Reset to top margin
    }
    return yPos;
  }

  private addText(
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    options: any = {}
  ): number {
    const {
      fontSize = 8,
      fontStyle = "normal",
      align = "left",
      maxWidth = null,
      lineHeight = 1.1,
    } = options;

    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);

    if (maxWidth) {
      const lines = doc.splitTextToSize(text, maxWidth);
      const totalHeight = lines.length * fontSize * lineHeight * 0.352778;

      // Check if we need a page break
      y = this.checkPageBreak(doc, y, totalHeight);

      doc.text(lines, x, y, { align });
      return y + totalHeight;
    } else {
      y = this.checkPageBreak(doc, y, fontSize * 0.352778);
      doc.text(text, x, y, { align });
      return y + fontSize * lineHeight * 0.352778;
    }
  }

  private addHeading(
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    fontSize: number = 10
  ): number {
    y = this.checkPageBreak(doc, y, 10);
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 114, 206); // Esure blue
    doc.text(text, x, y);
    return y + 4;
  }

  private addBulletPoint(
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    options: any = {}
  ): number {
    const { fontSize = 8, maxWidth = 165 } = options;
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    return this.addText(doc, `• ${text}`, x, y, {
      fontSize,
      maxWidth,
      lineHeight: 1.1,
    });
  }

  async generatePolicyDocument(policy: PolicyData): Promise<Buffer> {
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 15;

      // Add watermark (optional, light gray 'esure' repeated)
      doc.setTextColor(220, 220, 220);
      doc.setFontSize(32);
      for (let wy = 30; wy < 280; wy += 40) {
        for (let wx = 10; wx < 200; wx += 60) {
          doc.text("esure", wx, wy, { angle: -20 });
        }
      }
      doc.setTextColor(0, 0, 0);

      // Add logo (top left)
      try {
        const logoData = fs.readFileSync(this.logoPath);
        const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;
        doc.addImage(logoBase64, "PNG", 10, 10, 30, 15);
      } catch {}

      // Add blue 'esure' top right
      doc.setFontSize(22);
      doc.setTextColor(0, 114, 206);
      doc.setFont("helvetica", "bold");
      doc.text("esure", pageWidth - 35, 18);
      doc.setTextColor(0, 0, 0);

      // Orange box for title and policy info (resize to fit content)
      const boxX = 10;
      const boxY = 28;
      const boxWidth = pageWidth - 20;
      const boxHeight = 28; // Increased height to fit both title and info block
      doc.setDrawColor(255, 128, 0);
      doc.setLineWidth(1.2);
      doc.rect(boxX, boxY, boxWidth, boxHeight, "D");
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
          doc.setTextColor(0, 0, 0);
      doc.text("Certificate of Motor Insurance", 15, 38);

      // Certificate evidence lines inside the orange box
      let certY = 44;
      doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
      certY = this.addText(
        doc,
        "This certificate is evidence that you have insurance to comply with the law.",
        11,
        certY,
        { maxWidth: boxWidth - 20, fontSize: 8, lineHeight: 1.1 }
      );
      certY = this.addText(
        doc,
        "Please be aware it will not be valid if changed in any way.",
        11,
        certY,
        { maxWidth: boxWidth - 20, fontSize: 8, lineHeight: 1.1 }
      );
      y = boxY + boxHeight;

      // Date, Issue, Policy Number block (top right, more compact and spaced)
      const infoX = pageWidth - 90;
      let infoY = 32;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`Date of: ${this.formatDate(policy.startDate)}`, infoX, infoY);
      infoY += 5;
      // Wrap the block below using addText for width/height control
      doc.setFont("helvetica", "bold");
      infoY = this.addText(
        doc,
        `Issue: Certificate and\nPolicy Number : \n${policy.policyNumber}`,
        infoX,
        infoY,
        { maxWidth: 65, fontSize: 9, lineHeight: 1.2 }
      );
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      // Section 1: Description of vehicle
      let col1y = y + 10;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("1) Description of vehicle:", 17, col1y);
      doc.setFont("helvetica", "normal");
      col1y += 6;
      doc.setFont("helvetica", "bold");
      doc.text(`a) Vehicle Registration: ${policy.vehicleInfo.vehicleRegistration || "[VEHICLE REG NUMBER]"}`, 17, col1y);
      col1y += 6;
      doc.setFont("helvetica", "bold");
      doc.text(`Vehicle Model: ${policy.vehicleInfo.model || "-"}`, 17, col1y);
      col1y += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Vehicle Year of Manufacture: ${policy.vehicleInfo.yearOfManufacture || "-"}`, 17, col1y);
      col1y += 5;
      doc.setFont("helvetica", "bold");
      doc.text(`Vehicle Make: ${policy.vehicleInfo.make || "-"}`, 17, col1y);
      col1y += 10;
      col1y = this.addText(doc, "b) Any motor vehicle supplied to the policyholder by the company's recommended repairer or approved supplier while the vehicle described above is being repaired as a direct result of the damage covered by the policy.", 17, col1y, { maxWidth: 85, fontSize: 8, lineHeight: 1.2 });
      col1y += 2;
      col1y = this.addText(doc, "c) Any motor vehicle supplied to the policyholder by the company's approved vehicle supplier following the unrecovered theft of the total loss of the vehicle described above, which is the subject of a claim covered by the policy.", 17, col1y, { maxWidth: 85, fontSize: 8, lineHeight: 1.2 });
      col1y += 4;
      doc.setFont("helvetica", "bold");
      doc.text(`2) Name of policyholder: ${policy.userId.fullName}`, 17, col1y);
      col1y += 6;
      doc.setFont("helvetica", "normal");
      col1y = this.addText(
        doc,
        `Effective date of the commencement of insurance for the purposes of the relevant law: ${this.formatDate(policy.startDate)} at 00:00 hours`,
        17,
        col1y,
        { maxWidth: 85, fontSize: 8, lineHeight: 1.2 }
      );
      col1y += 2;
      doc.text(`Date of expiry of insurance: ${this.formatDate(policy.endDate)} at 23:59 hours`, 17, col1y);
      col1y += 6;
      doc.text(`Persons or classes of persons entitled to drive:`, 17, col1y);
      col1y += 5;
      col1y = this.addText(doc, "Provided that the person driving holds a licence to drive the vehicle and is not disqualified from holding or obtaining such a licence.", 17, col1y, { maxWidth: 85, fontSize: 8, lineHeight: 1.2 });
      col1y += 2;
      col1y = this.addText(doc, "I hereby certify that the policy to which this certificate relates satisfies the requirements of the relevant law applicable in Great Britain, Northern Ireland, the Isle of Man, the Island of Jersey, the Island of Guernsey and the Island of Alderney.", 17, col1y, { maxWidth: 85, fontSize: 8, lineHeight: 1.2 });
      col1y += 2;
      col1y = this.addText(doc, "Advice to third parties: Nothing contained in this certificate affects your rights as a third party to make a claim.", 17, col1y, { maxWidth: 85, fontSize: 8, lineHeight: 1.2 });

      // Blue vertical lines for columns (shorten to col1y)
      doc.setDrawColor(0, 114, 206);
      doc.setLineWidth(3);
      doc.line(15, y + 5, 15, col1y + 3); // end just after last line
      doc.line(pageWidth / 2, y + 5, pageWidth / 2, col1y + 3);

      // Section 2: Driving other cars (right column)
      let col2y = y + 10;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("3) Driving other cars:", pageWidth / 2 + 5, col2y);
      doc.setFont("helvetica", "normal");
      col2y += 6;
      col2y = this.addText(doc, `The policyholder, ${policy.userId.fullName}, may also drive a car that is not described above, not hired or leased to them under a hire purchase or leasing agreement, with the owner's permission to drive.`, pageWidth / 2 + 7, col2y, { maxWidth: 85, fontSize: 8, lineHeight: 1.2 });
      col2y += 4;
      doc.setFont("helvetica", "bold");
      doc.text("4) Limitations as to use:", pageWidth / 2 + 5, col2y);
      doc.setFont("helvetica", "normal");
      col2y += 6;
      doc.text("Use for social, domestic and pleasure purposes only", pageWidth / 2 + 7, col2y);
      col2y += 6;
      doc.text("This policy does not cover:", pageWidth / 2 + 7, col2y);
      col2y += 6;
      col2y = this.addText(doc, "- Use for travel to or from any place of study or work", pageWidth / 2 + 9, col2y, { maxWidth: 80, fontSize: 8, lineHeight: 1.2 });
      col2y += 2;
      col2y = this.addText(doc, "- Use for any business use including courier or food collection or delivery, hire or carrying goods or people for payment", pageWidth / 2 + 9, col2y, { maxWidth: 80, fontSize: 8, lineHeight: 1.2 });
      col2y += 2;
      col2y = this.addText(doc, "- Use for any purpose in connection with the motor trade", pageWidth / 2 + 9, col2y, { maxWidth: 80, fontSize: 8, lineHeight: 1.2 });
      col2y += 2;
      col2y = this.addText(doc, "- Use for competitions, off-road events, pace making, racing, rallies, speed testing, track days or trials", pageWidth / 2 + 9, col2y, { maxWidth: 80, fontSize: 8, lineHeight: 1.2 });
      col2y += 2;
      col2y = this.addText(doc, "- Use to secure the release of a vehicle which has been seized by or on behalf of any government or public authority other than the vehicle whose registration is listed in this certificate", pageWidth / 2 + 9, col2y, { maxWidth: 80, fontSize: 8, lineHeight: 1.2 });

      // Signature and CEO block
      let signY = Math.max(col1y, col2y) + 18;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 114, 206);
      doc.text("For full details of your insurance cover take a look at your latest policy booklet and schedule.", 15, signY);
      doc.setTextColor(0, 0, 0);
      signY += 8;
      // Signature image
      try {
        const sigData = fs.readFileSync(this.signaturePath);
        const sigBase64 = `data:image/png;base64,${sigData.toString("base64")}`;
        doc.addImage(sigBase64, "PNG", 15, signY, 30, 10);
      } catch {}
      signY += 12;
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("David McMillan", 15, signY);
      doc.setFont("helvetica", "normal");
      doc.text("Chief Executive Officer", 15, signY + 5);
      doc.text("esure Insurance Limited, The Observatory, Reigate, Surrey, RH2 0SG", 15, signY + 10);
      doc.text("Authorised Insurer", 15, signY + 15);

      // Return as buffer
      return Buffer.from(doc.output("arraybuffer"));
    } catch (err) {
      throw err;
    }
  }
}

export const pdfProcessor = new PdfProcessor();
