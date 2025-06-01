import PDFDocument from 'pdfkit';
import fs from 'fs';
import { RepoComplexity } from './types';

export function generatePDF(client: string, data: RepoComplexity[]) {
  const doc = new PDFDocument();
  const filePath = `report-${client}.pdf`;
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text(`Complexity Report - ${client}`, { underline: true });

  let total = 0;
  doc.moveDown();

  data.forEach(entry => {
    doc.fontSize(12).text(
      `${entry.repo} | ${entry.language} | ${entry.code} lignes | Score: ${entry.complexity}`
    );
    total += entry.complexity;
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total complexity score: ${total}`);

  doc.end();
  console.log(`✔️ Rapport PDF généré pour ${client}: ${filePath}`);
}
