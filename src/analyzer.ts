import { ClocResult, RepoComplexity } from "./types";
import { complexityMap } from "./complexity";
import { getVB6Complexity } from "./utils/vb6Complexity";
import { log } from "console";

export function analyzeRepo(
  repoName: string,
  clocResults: ClocResult[],
  repoPath: string
): RepoComplexity[] {
  const clocMapped: RepoComplexity[] = clocResults.map((result) => {
    const factor = complexityMap[result.language] ?? 1;
    return {
      repo: repoName,
      language: result.language,
      code: result.code,
      complexity: result.code * factor,
      source: "git",
    };
  });
  log(`📊 ${repoName} - Cloc Complexity: ${clocMapped.length} entries`);

  const vb6Entries = getVB6Complexity(repoPath).map((entry) => ({
    ...entry,
    repo: repoName,
    source: "git" as const,
  }));
  log(`📊 ${repoName} - VB6 Complexity: ${vb6Entries.length} entries`);

  if (clocMapped.length === 0) {
    log(`⚠️ Aucun code trouvé dans ${repoPath}`);
  }
  if (vb6Entries.length === 0) {
    log(`⚠️ Aucun fichier VB6 trouvé dans ${repoPath}`);
  }
  if (clocMapped.length === 0 && vb6Entries.length === 0) {
    log(`⚠️ Aucun code trouvé dans ${repoPath}`);
  }

  return [...clocMapped, ...vb6Entries];
}
