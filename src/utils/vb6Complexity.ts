import fs from "fs-extra";
import path from "path";
import { BinaryFileComplexity } from "../types";

const vb6Extensions = [".bas", ".cls", ".frm"];

const decisionPatterns = [
  /^\s*If\b/i,
  /^\s*ElseIf\b/i,
  /^\s*For\b/i,
  /^\s*Do\b/i,
  /^\s*While\b/i,
  /^\s*Select\s+Case\b/i,
  /^\s*On\s+Error\s+GoTo\b/i,
  /^\s*GoTo\b/i,
];

function countDecisionsInFile(filePath: string): number {
  let decisions = 0;
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      if (decisionPatterns.some((pattern) => pattern.test(line))) {
        decisions++;
      }
    }
  } catch (e) {
    console.warn(`⚠️ Impossible de lire ${filePath}: ${e}`);
  }
  return decisions;
}

function sumSizeInKB(filePaths: string[]): number {
  let total = 0;
  for (const filePath of filePaths) {
    try {
      const stats = fs.statSync(filePath);
      total += stats.size;
    } catch (e) {
      console.warn(`⚠️ Impossible d'obtenir la taille de ${filePath}: ${e}`);
    }
  }
  return Math.round(total / 1024);
}

export function getVB6Complexity(dir: string): BinaryFileComplexity[] {
  const fileList: string[] = [];

  function collectVB6Files(currentDir: string) {
    const entries = fs.readdirSync(currentDir);
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        collectVB6Files(fullPath);
      } else if (vb6Extensions.includes(path.extname(entry).toLowerCase())) {
        fileList.push(fullPath);
      }
    }
  }

  collectVB6Files(dir);

  const totalDecisions = fileList
    .map(countDecisionsInFile)
    .reduce((a, b) => a + b, 0);

  const sizeInKB = sumSizeInKB(fileList);

  return totalDecisions > 0
    ? [
        {
          language: "VB6",
          sizeInKB,
          complexity: totalDecisions + 1,
        },
      ]
    : [];
}
