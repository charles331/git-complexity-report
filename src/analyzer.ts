import { ClocResult, RepoComplexity } from './types';

const complexityMap: Record<string, number> = {
  Java: 1,
  TypeScript: 2,
  JavaScript: 2,
  HTML: 1,
  CSS: 1,
  VB: 3,
  XML: 1,
  JSON: 1,
};

export function analyzeRepo(repoName: string, clocResults: ClocResult[]): RepoComplexity[] {
  return clocResults.map(result => {
    const factor = complexityMap[result.language] ?? 1;
    return {
      repo: repoName,
      language: result.language,
      code: result.code,
      complexity: result.code * factor
    };
  });
}
