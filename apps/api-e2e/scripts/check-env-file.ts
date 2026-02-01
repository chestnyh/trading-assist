import { exec } from 'child_process';

// TODO: .env.api-int-tests - not the best name for the file.
exec('dotenv -e .env.api-int-testss -- echo "✓ .env.api-int-tests exists"', (error, stdout, stderr) => {
  if (error) {
    console.error(`error: ${error.message}`);
    process.exit(1);
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    process.exit(1);
  }
  console.log(`✓ .env.api-int-tests exists`);
});