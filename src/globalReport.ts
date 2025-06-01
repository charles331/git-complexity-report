import PDFDocument from "pdfkit";
import fs from "fs";
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import { RepoComplexity } from "./types";
import path from "path";

interface ClientSummary {
  client: string;
  repos: number;
  languages: Set<string>;
  lines: number;
  complexity: number;
}

const chartWidth = 800;
const chartHeight = 400;

async function generateBarChart(summaries: ClientSummary[], filePath: string) {
  const canvas = new ChartJSNodeCanvas({
    width: chartWidth,
    height: chartHeight,
  });

  const config = {
    type: "bar" as const,
    data: {
      labels: summaries.map((s) => s.client),
      datasets: [
        {
          label: "Complexité",
          data: summaries.map((s) => s.complexity),
        },
      ],
    },
    options: {
      indexAxis: "x" as const,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Complexité par client",
        },
      },
      responsive: false,
    },
  };

  const buffer = await canvas.renderToBuffer(config);
  fs.writeFileSync(filePath, buffer);
}

export async function generateGlobalReport(
  allData: Record<string, RepoComplexity[]>
) {
  const summaries: ClientSummary[] = Object.entries(allData).map(
    ([client, data]) => {
      const repos = new Set(data.map((d) => d.repo)).size;
      const languages = new Set(data.map((d) => d.language));
      const lines = data.reduce((sum, d) => sum + (d.code ?? 0), 0);
      const complexity = data.reduce((sum, d) => sum + d.complexity, 0);
      return { client, repos, languages, lines, complexity };
    }
  );

  const chartFile = path.resolve("generated", "chart.png");
  await generateBarChart(summaries, chartFile);

  const doc = new PDFDocument({ layout: "landscape" });
  const output = path.resolve("generated", "report-global.pdf");
  doc.pipe(fs.createWriteStream(output));

  doc.fontSize(20).text("Global Complexity Report", { align: "center" });
  doc.moveDown();

  doc.image(chartFile, {
    fit: [700, 300],
    align: "center",
    valign: "center",
  });

  doc.addPage({ layout: "landscape" });
  doc.fontSize(16).text("Légende détaillée", { underline: true });
  doc.moveDown();

  summaries.forEach((summary) => {
    const clientData = allData[summary.client];
    const sources = new Set(clientData.map((d) => d.source ?? "git"));
    const sourceText = Array.from(sources).join(", ");
    doc
      .fontSize(12)
      .text(
        `Client ${summary.client} — ${summary.repos} repo(s) \nSummary ${
          summary.lines
        } lignes, complexité ${summary.complexity} \nLangages : ${Array.from(
          summary.languages
        ).join(", ")}\n` + `Sources : ${sourceText}`
      )
      .moveDown(0.5);
  });

  doc.end();
  console.log(`📄 Rapport global généré avec graphique : ${output}`);
}
