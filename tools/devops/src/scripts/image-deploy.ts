import { execSync } from 'child_process';
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

  const username = await project.getUsername();
  const password = await project.getPassword();
  const proxyEndpoint = await project.getProxyEndpoint();

  const imageName = project.imageName;
  const imageTag = project.imageTag;
  const imageRepoUrl = project.imageRepoUrl;
  const dockerfile = project.dockerfile;

  // Docker login
  execSync(
    `docker login -u ${username} --password-stdin ${proxyEndpoint.replace('https://', '')}`,
    { input: password, stdio: ['pipe', 'inherit', 'inherit'] }
  );

  // 2. Build Docker image
  console.log('Building Docker image...');
  execSync(
    `docker build -f ${dockerfile} -t ${imageName}:${imageTag} .`,
    { stdio: 'inherit' }
  );

  // 3. Tag Docker image for ECR
  console.log('Tagging Docker image for ECR...');
  execSync(
    `docker tag ${imageName}:${imageTag} ${imageRepoUrl}:${imageTag}`,
    { stdio: 'inherit' }
  );

  // 4. Push Docker image to ECR
  console.log('Pushing Docker image to ECR...');
  execSync(
    `docker push ${imageRepoUrl}:${imageTag}`,
    { stdio: 'inherit' }
  );
}

main().catch((err) => {
  console.error('Error during image deploy:', err);
  process.exit(1);
});
