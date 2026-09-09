// Test fixtures for Phase 3 E2E: a text-layer PDF (pdf.js extraction) and a
// PNG with text (tesseract.js OCR path). Saved under upload/ (gitignored).
import { jsPDF } from "jspdf";
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "fs";

mkdirSync("/home/z/my-project/upload", { recursive: true });

const doc = new jsPDF();
doc.setFontSize(12);
doc.text("Fee agreement between Maria Lopez and the Law Office of James Smith", 12, 24);
doc.text("Signed June 1, 2026. Flat fee of $4,500 for the family case.", 12, 40);
doc.text("The client paid a retainer of $2,000 by card on June 2, 2026.", 12, 56);
doc.text("No administrative charges were agreed in this contract.", 12, 72);
writeFileSync("/home/z/my-project/upload/test-fee-agreement.pdf", Buffer.from(doc.output("arraybuffer")));

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="320">
  <rect width="100%" height="100%" fill="white"/>
  <text x="40" y="90" font-size="36" font-family="DejaVu Sans" fill="black">RECEIPT</text>
  <text x="40" y="160" font-size="28" font-family="DejaVu Sans" fill="black">Cash retainer $1,500 received</text>
  <text x="40" y="220" font-size="24" font-family="DejaVu Sans" fill="black">July 15 2026 - Law Office of James Smith</text>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile("/home/z/my-project/upload/test-receipt.png");

console.log("fixtures written");
