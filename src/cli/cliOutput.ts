import pc from 'picocolors';
import path from 'node:path';
import type { SecretLintCoreResult } from '@secretlint/types';

export function printSummary(
  rootDir: string,
  totalFiles: number,
  totalCharacters: number,
  outputPath: string,
  suspiciousFilesResults: SecretLintCoreResult[],
) {
  const relativeOutputPath = path.relative(rootDir, outputPath);

  let securityCheckMessage = '';
  if (suspiciousFilesResults.length > 0) {
    securityCheckMessage = pc.yellow(`${suspiciousFilesResults.length} suspicious file(s) detected and excluded`);
  } else {
    securityCheckMessage = pc.white('✔ No suspicious files detected');
  }

  console.log(pc.white('📊 Pack Summary:'));
  console.log(pc.dim('────────────────'));
  console.log(`${pc.white('Total Files:')} ${pc.white(totalFiles.toString())}`);
  console.log(`${pc.white('Total Chars:')} ${pc.white(totalCharacters.toString())}`);
  console.log(`${pc.white('     Output:')} ${pc.white(relativeOutputPath)}`);
  console.log(`${pc.white('   Security:')} ${pc.white(securityCheckMessage)}`);
}

export function printSecurityCheck(rootDir: string, suspiciousFilesResults: SecretLintCoreResult[]) {
  console.log(pc.white('🔎 Security Check:'));
  console.log(pc.dim('──────────────────'));

  if (suspiciousFilesResults.length === 0) {
    console.log(pc.green('✔') + ' ' + pc.white('No suspicious files detected.'));
  } else {
    console.log(
      pc.yellow(`${suspiciousFilesResults.length} suspicious file(s) detected and excluded from the output:`),
    );
    suspiciousFilesResults.forEach((suspiciousFilesResult, index) => {
      const relativeFilePath = path.relative(rootDir, suspiciousFilesResult.filePath);
      console.log(`${pc.white(`${index + 1}.`)} ${pc.white(relativeFilePath)}`);
      console.log(pc.dim('   - ' + suspiciousFilesResult.messages.map((message) => message.message).join('\n   - ')));
    });
    console.log(pc.yellow('\nThese files have been excluded from the output for security reasons.'));
    console.log(pc.yellow('Please review these files for potential sensitive information.'));
  }
}

export function printTopFiles(fileCharCounts: Record<string, number>, topFilesLength: number) {
  console.log(pc.white(`📈 Top ${topFilesLength} Files by Character Count:`));
  console.log(pc.dim('──────────────────────────────────'));

  const topFiles = Object.entries(fileCharCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topFilesLength);

  topFiles.forEach(([filePath, count], index) => {
    const indexString = `${index + 1}.`.padEnd(3, ' ');
    console.log(`${pc.white(`${indexString}`)} ${pc.white(filePath)} ${pc.dim(`(${count} chars)`)}`);
  });
}

export function printCompletion() {
  console.log(pc.green('🎉 All Done!'));
  console.log(pc.white('Your repository has been successfully packed.'));
}
