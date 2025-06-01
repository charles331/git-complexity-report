export type ClientRepos = Record<string, string[]>;

export interface ClocResult {
  language: string;
  files: number;
  blank: number;
  comment: number;
  code: number;
}

export interface RepoComplexity {
  repo: string;
  language: string;
  code: number;
  complexity: number;
  source?: "git" | "local";
}
