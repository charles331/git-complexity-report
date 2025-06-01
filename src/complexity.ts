export const complexityMap: Record<string, number> = {
  Java: 1,
  TypeScript: 2,
  JavaScript: 2,
  HTML: 1,
  CSS: 1,
  VB: 3,
  SQL: 2,
  Dockerfile: 2,
  "Prisma Schema": 2,
  Shell: 2,
  TOML: 1,
  SUM: 1,
};

export const excludedLanguages: string[] = ["SUM"];

export const excludedExtensionsRegex = "(?i)\\.(job)$"; // insensible à la casse

/**
 * const complexityMap: Record<string, number> = {
   Java: 1,
   TypeScript: 2,
   JavaScript: 2,
   HTML: 1,
   CSS: 1,
   VB: 3,
   XML: 1,
   JSON: 1,
 };

 const complexityMap: Record<string, number> = {
   Java: 3,
   TypeScript: 2,
   JavaScript: 2,
   HTML: 1,
   CSS: 1,
   VB: 3,
   SQL: 2,
   Dockerfile: 2,
   "Prisma Schema": 2,
   Shell: 2,
   TOML: 1,
   SUM: 1,
 };
 
 */
