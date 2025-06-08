import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import { RepoComplexity, ClocResult } from "./types";
import {
  excludedLanguages,
  complexityMap,
  excludedExtensionsRegex,
} from "./complexity";
import { getBinaryComplexity } from "./utils/binaryComplexity";
import binaryRules from "./utils/binaryRules";
import { BinaryFileComplexity } from "./types";
import { getVB6Complexity } from "./utils/vb6Complexity";
import { log } from "console";

function runCloc(projectPath: string): Promise<ClocResult[]> {
  return new Promise((resolve, reject) => {
    exec(
      `cloc ${projectPath} --json --exclude-dir=node_modules --not-match-f='${excludedExtensionsRegex}'`,
      (err, stdout) => {
        if (err) return reject(err);
        const raw = JSON.parse(stdout);
        const results = Object.entries(raw)
          .filter(
            ([lang]) => lang !== "header" && !excludedLanguages.includes(lang)
          )
          .map(([language, data]: any) => ({
            language,
            ...data,
          }));
        resolve(results);
      }
    );
  });
}

export async function analyzePackages(
  packagesDir: string
): Promise<Record<string, RepoComplexity[]>> {
  const result: Record<string, RepoComplexity[]> = {};

  const clients = await fs.readdir(packagesDir);
  for (const client of clients) {
    const clientPath = path.join(packagesDir, client);
    const stat = await fs.stat(clientPath);
    if (!stat.isDirectory()) continue;

    const projects = await fs.readdir(clientPath);
    for (const project of projects) {
      const projectPath = path.join(clientPath, project);
      const projectStat = await fs.stat(projectPath);
      if (!projectStat.isDirectory()) continue;

      try {
        const clocResults = await runCloc(projectPath);
        const repoResults = clocResults.map((result) => {
          const factor = complexityMap[result.language] ?? 1;
          return {
            repo: `[local] ${project}`,
            language: result.language,
            code: result.code,
            complexity: result.code * factor,
            source: "local" as const,
          };
        });

        const binaryResults = getBinaryComplexity(projectPath, binaryRules).map(
          (entry: BinaryFileComplexity) => {
            const { language, sizeInKB } = entry;
            const factor = complexityMap[language] ?? 1;
            return {
              repo: `[local] ${project}`,
              language,
              sizeInKB,
              complexity: sizeInKB * factor,
              source: "local" as const,
            };
          }
        );
        log(`Binary results for ${projectPath}:`, binaryResults);
        if (binaryResults.length === 0) {
          log(`⚠️ Aucun fichier binaire trouvé dans ${projectPath}`);
        }

        const vb6Results = getVB6Complexity(projectPath).map((entry) => ({
          ...entry,
          repo: `[local] ${project}`,
          source: "local" as const,
        }));

        log(`VB6 results for ${projectPath}:`, vb6Results);
        if (vb6Results.length === 0) {
          log(`⚠️ Aucun fichier VB6 trouvé dans ${projectPath}`);
        }
        if (
          repoResults.length === 0 &&
          binaryResults.length === 0 &&
          vb6Results.length === 0
        ) {
          log(`⚠️ Aucun code trouvé dans ${projectPath}`);
        }

        if (!result[client]) result[client] = [];
        result[client].push(...repoResults, ...binaryResults, ...vb6Results);
      } catch (error) {
        console.warn(`⚠️ Erreur d'analyse pour ${projectPath}: ${error}`);
      }
    }
  }

  return result;
}
