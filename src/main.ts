import fs from "fs-extra";
import path from "path";
import { ClientRepos, RepoComplexity } from "./types";
import { cloneRepo, runCloc } from "./cloc";
import { analyzeRepo } from "./analyzer";
import { generatePDF } from "./pdfGenerator";
import { generateGlobalReport } from "./globalReport";
import { analyzePackages } from "./packagesAnalyzer";

const clientsPath = path.resolve("clients.json");
const baseDir = path.resolve("repos");

async function main() {
  await fs.ensureDir("generated");
  await fs.emptyDir("generated");

  const clients: ClientRepos = await fs.readJSON(clientsPath);
  const clientReports: Record<string, RepoComplexity[]> = {};

  for (const [client, repos] of Object.entries(clients)) {
    const results = [];

    for (const repoUrl of repos) {
      const repoName =
        repoUrl.split("/").pop()?.replace(".git", "") || "unknown";
      const repoDir = path.join(baseDir, client, repoName);

      await cloneRepo(repoUrl, repoDir);
      const clocData = await runCloc(repoDir);
      const analyzed = analyzeRepo(repoName, clocData, repoDir);
      analyzed.forEach((r) => (r.source = "git"));
      results.push(...analyzed);
    }

    generatePDF(client, results, "git");
    clientReports[client] = results;
    await fs.writeJSON(
      path.resolve("generated", `report-${client}-git.json`),
      results,
      { spaces: 2 }
    );
  }

  const packageResults = await analyzePackages("packages");
  for (const [client, results] of Object.entries(packageResults)) {
    if (!clientReports[client]) clientReports[client] = [];
    clientReports[client].push(...results);
    generatePDF(client, results, "local");
    generatePDF(client, results, "local");

    await fs.writeJSON(
      path.resolve("generated", `report-${client}-local.json`),
      results,
      { spaces: 2 }
    );
  }

  generateGlobalReport(clientReports);
}

main().catch((err) => console.error("❌ Erreur:", err));
