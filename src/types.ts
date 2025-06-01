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
  code?: number;
  sizeInKB?: number;
  complexity: number;
  source?: "git" | "local";
}

export type BinaryComplexityMetric = "sizeInKB";

export interface BinaryComplexityRule {
  asLanguage: string; // Comment tu veux que ce type soit représenté dans le rapport
  extensions: string[]; // Liste des extensions de fichiers à inclure
  metric: BinaryComplexityMetric; // Métrique à utiliser (actuellement uniquement "sizeInKB")
}

export interface BinaryFileComplexity {
  language: string;
  sizeInKB: number;
  complexity: number;
}

export interface BinaryComplexityRule {
  asLanguage: string;
  extensions: string[];
  metric: "sizeInKB";
}

export interface BinaryFileComplexity {
  language: string;
  sizeInKB: number;
  complexity: number;
}
