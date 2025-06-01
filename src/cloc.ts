import simpleGit from "simple-git";
import { exec } from "child_process";
import fs from "fs-extra";
import { ClocResult } from "./types";
import { excludedLanguages } from "./complexity";

export async function cloneRepo(url: string, targetDir: string) {
  const git = simpleGit();
  if (!fs.existsSync(targetDir)) {
    await git.clone(url, targetDir, ["--depth", "1"]);
  } else {
    await simpleGit(targetDir).pull();
  }
}

export function runCloc(dir: string): Promise<ClocResult[]> {
  return new Promise((resolve, reject) => {
    exec(`cloc ${dir} --json`, (err, stdout) => {
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
    });
  });
}
