import path from 'path';
import SSH2Promise from 'ssh2-promise';
import { awsGetECRCredentials } from './helpers';

export default async function awsContainerDeploy() {
    // 1. Create SSH connection
    const sshConfig = {
        host: this.configProvider.get('AWS_EC2_SSH_HOST'),
        username: this.configProvider.get('AWS_EC2_SSH_USER'),
        port: this.configProvider.get('AWS_EC2_SSH_PORT'),
        identity: path.join(__dirname, '..', '..', '..', '..', '..', this.configProvider.get('AWS_EC2_SSH_PEM_PATH')),
    }
    const ssh = new SSH2Promise(sshConfig);
    await ssh.connect();

    // 1. Get ECR credentials
    const { username, password, proxyEndpoint } = await awsGetECRCredentials(this.configProvider);

    // 2. Login to ECR
    console.log('Logging into ECR...');
    try {
        console.log(`echo "${password}" | docker login --username ${username} --password-stdin ${proxyEndpoint}`);
        await ssh.exec(`echo "${password}" | docker login --username ${username} --password-stdin ${proxyEndpoint}`);
    } catch (error) {
        console.error('Error logging into ECR:', error);
        // throw error;
    }

    // 3. Pull the latest image from ECR
    console.log('Pulling image from ECR...');
    console.log(`docker pull ${this.getImageRepoUrl()}:${this.imageTag}`);
    await ssh.exec(`docker pull ${this.getImageRepoUrl()}:${this.imageTag}`);

    // 4. Stop and remove existing container if it exists
    console.log('Stopping existing container...');
    try {
        await ssh.exec('docker stop  data-ops || true');
    } catch (error) {
        // ignore if container does not exist
    }
    try {
        await ssh.exec('docker rm data-ops || true');
    } catch (error) {
        // ignore if container does not exist
    }

    console.log('Starting new container...');
    const runScript = this.getContainerRunScript();
    await ssh.exec(runScript);
    console.log('Container deployed successfully!');

    ssh.close();

}