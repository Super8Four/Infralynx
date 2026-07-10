import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

if (existsSync('.git')) {
  const result = spawnSync(
    'git',
    ['config', '--local', 'core.hooksPath', '.githooks'],
    { stdio: 'inherit' },
  );

  if (result.error) {
    console.warn(`Git hook setup skipped: ${result.error.message}`);
  } else if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
  }
}
