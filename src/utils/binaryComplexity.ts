import fs from "fs-extra";
import path from "path";
import { BinaryComplexityRule, BinaryFileComplexity } from "../types";

export function getBinaryComplexity(
  dir: string,
  rules: Record<string, BinaryComplexityRule>
): BinaryFileComplexity[] {
  const result: BinaryFileComplexity[] = [];

  for (const key in rules) {
    const rule = rules[key];
    const sizeInKB = sumFileSizes(dir, rule.extensions);

    if (sizeInKB > 0) {
      result.push({
        language: rule.asLanguage,
        sizeInKB,
        complexity: sizeInKB, // le facteur de complexité sera appliqué ailleurs
      });
    }
  }

  return result;
}

function sumFileSizes(dir: string, extensions: string[]): number {
  let total = 0;

  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (
      stat.isFile() &&
      extensions.includes(path.extname(entry).toLowerCase())
    ) {
      total += stat.size;
    } else if (stat.isDirectory()) {
      total += sumFileSizes(fullPath, extensions);
    }
  }

  return Math.round(total / 1024); // convert to KB
}
