import fs from 'fs-extra';
import path from 'path';
import { ClientRepos } from './types';
import { cloneRepo, runCloc } from './cloc';
import { analyzeRepo } from './analyzer';
import { generatePDF } from './pdfGenerator';

const clientsPath = path.resolve('clients.json');
const baseDir = path.resolve('repos');

async function main() {
  const clients: ClientRepos = await fs.readJSON(clientsPath);

  for (const [client, repos] of Object.entries(clients)) {
    const results = [];

    for (const repoUrl of repos) {
      const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'unknown';
      const repoDir = path.join(baseDir, client, repoName);

      await cloneRepo(repoUrl, repoDir);
      const clocData = await runCloc(repoDir);
      const analyzed = analyzeRepo(repoName, clocData);

      results.push(...analyzed);
    }

    generatePDF(client, results);
  }
}

main().catch(err => console.error('❌ Erreur:', err));
