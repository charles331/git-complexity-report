import PDFDocument from "pdfkit";
import fs from "fs";
import { RepoComplexity } from "./types";
import path from "path";

export function generatePDF(
  client: string,
  data: RepoComplexity[],
  source?: "git" | "local"
) {
  const doc = new PDFDocument();
  const suffix = source ? `-${source}` : "";
  const filePath = path.resolve("generated", `report-${client}${suffix}.pdf`);
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text(`Complexity Report - ${client}`, { underline: true });

  let total = 0;
  doc.moveDown();

  data.forEach((entry) => {
    doc
      .fontSize(12)
      .text(
        `${entry.repo} | ${entry.language} | ${entry.code} lignes | Score: ${entry.complexity}`
      );
    total += entry.complexity;
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total complexity score: ${total}`);

  doc.end();
  console.log(`✔️ Rapport PDF généré pour ${client}: ${filePath}`);
}
