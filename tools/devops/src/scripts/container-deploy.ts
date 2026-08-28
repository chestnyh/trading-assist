/**
 * Script to print out the EC2 user-data script for running a Docker container from ECR.
 * 
 * Usage:
 *   ts-node tools/devops/src/scripts/ec2-container-deploy.ts --project_name auto-trader
 * 
 * Prints a bash script that can be used as EC2 user-data to:
 *   - Install Docker (if not present)
 *   - Authenticate to ECR
 *   - Pull the latest image
 *   - Run the container
 */

import { parseArgs } from 'node:util';

// Parse CLI args
const args = parseArgs({
  options: {
    project_name: { 
      type: 'string', 
      short: 'p' 
    },
    help: {
      type: 'boolean',
      short: 'h',
      default: false,
    }
  },
});

const help = args?.values?.help;

if (help) {
  console.log(`
Usage: ts-node tools/devops/src/scripts/container-deploy.ts

Options:
  -p, --project_name    The name of the project (e.g. auto-trader)
  -h, --help            Show this help message and exit
`);
  process.exit(0);
}

if(!args?.values?.project_name) {
  console.error('Please provide a project name for the image to deploy');
  process.exit(1);
}

const projectName = args?.values?.project_name;

// Dynamically import the project class
/* eslint @typescript-eslint/no-var-requires: "off" */
const { default: Project } = require(`../projects/${projectName}/project`);
const project = new Project();

async function main() {
  await project.containerDeploy();
}

main().catch((err) => {
  console.error('Error container deploy:', err);
  process.exit(1);
});
