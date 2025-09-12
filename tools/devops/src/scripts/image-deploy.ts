import { parseArgs } from 'node:util';

/**
 * Script to build, tag, push Docker image container registry.
 * 
 * Prerequisites:
 * - All credentials configured.
 * - Docker installed and running.
 * - Docker repository already created.
 */

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
Usage: nx run auto-trader:image:deploy

Options:
  -p, --project_name    The name of the image to deploy
  -h, --help    Show this help message and exit
`);
  process.exit(0);
}

if(!args?.values?.project_name) {
  console.error('Please provide a project name for the image to deploy');
  process.exit(1);
}

const projectName = args?.values?.project_name;

// import configs from project file
const { default: Project } = require(`../projects/${projectName}/project`);

const project = new Project();

async function main() {
  await project.imageDeploy();
}

main().catch((err) => {
  console.error('Error during image deploy:', err);
  process.exit(1);
});
