import { ClocResult, RepoComplexity } from "./types";
import { complexityMap } from "./complexity";

export function analyzeRepo(
  repoName: string,
  clocResults: ClocResult[]
): RepoComplexity[] {
  return clocResults.map((result) => {
    const factor = complexityMap[result.language] ?? 1;
    return {
      repo: repoName,
      language: result.language,
      code: result.code,
      complexity: result.code * factor,
    };
  });
}
