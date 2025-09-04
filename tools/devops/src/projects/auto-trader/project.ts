import path from 'path';
import fs from 'fs';
import { ECRClient, GetAuthorizationTokenCommand } from "@aws-sdk/client-ecr";
import SSH2Promise from 'ssh2-promise';
import { Buffer } from "buffer";
import { DevopsConfigs } from '@trading-bot/configs';
import DevopsProject from '../DevopsProject';
const devopsConfigs = new DevopsConfigs();

export default class AutoTraderProject extends DevopsProject {
  
  private awsEcrRegion: string;
  private awsEcrAccountId: string;
  private awsEcrRepo: string;


  constructor() {
    super();
    this.name = 'auto-trader';
    this.imageName = 'auto-trader';
    this.imageTag = 'latest';
    this.dockerfile = path.join(__dirname, '..', '..', '..', '..', '..','apps', 'auto-trader', 'Dockerfile');
    this.awsEcrRegion = devopsConfigs.get('AWS_ECR_REGION');
    this.awsEcrAccountId = devopsConfigs.get('AWS_ECR_ACCOUNT_ID');
    this.awsEcrRepo = `${devopsConfigs.get('AWS_ECR_REPO_NAMESPACE')}/auto-trader`;
  }

  get imageRepoUrl() {
    return `${this.awsEcrAccountId}.dkr.ecr.${this.awsEcrRegion}.amazonaws.com/${this.awsEcrRepo}`;
  }

  private async getUsernameAndPassword() {
    // 1. Authenticate Docker to ECR using AWS SDK
    console.log('Authenticating Docker to AWS ECR using @aws-sdk/client-ecr...');
    
    const ecrClient = new ECRClient({ 
      region: this.awsEcrRegion,
      credentials: {
        accessKeyId: devopsConfigs.get('AWS_ECR_ACCESS_KEY_ID'),
        secretAccessKey: devopsConfigs.get('AWS_ECR_SECRET_ACCESS_KEY'),
      }
    });

    const authCommand = new GetAuthorizationTokenCommand({
      registryIds: [this.awsEcrAccountId],
    });

    console.log('Sending auth command to AWS ECR...');

    const authResponse = await ecrClient.send(authCommand);

    console.log('Auth command sent to AWS ECR...');

    if (
      !authResponse.authorizationData ||
      !authResponse.authorizationData[0] ||
      !authResponse.authorizationData[0].authorizationToken ||
      !authResponse.authorizationData[0].proxyEndpoint
    ) {
      throw new Error("Failed to get ECR authorization token.");
    }

    const { authorizationToken, proxyEndpoint } = authResponse.authorizationData[0];
    // The token is base64(username:password)
    const decoded = Buffer.from(authorizationToken, 'base64').toString('utf-8');
    const [username, password] = decoded.split(':');
    this.username = username;
    this.password = password;
    this.proxyEndpoint = proxyEndpoint;
  }

  async getUsername() {
    if(!this.username) {
      await this.getUsernameAndPassword();
    }
    return this.username;
  }

  async getPassword() {
    if(!this.password) {
      await this.getUsernameAndPassword();
    }
    return this.password;
  }

  async getProxyEndpoint() {
    if(!this.proxyEndpoint) {
      await this.getUsernameAndPassword();
    }
    return this.proxyEndpoint;
  }

  async containerDeploy() {
    const sshConfig = {
      host: 'ec2-13-60-24-25.eu-north-1.compute.amazonaws.com',
      username: 'ec2-user',
      port: 22,
      identity: path.join(__dirname, '..', '..', '..', '..', '..', 'auto-trader.pem'),
    }

    const ssh = new SSH2Promise(sshConfig);
    await ssh.connect();

    // 1. Get ECR credentials
    const username = await this.getUsername();
    const password = await this.getPassword();
    const proxyEndpoint = await this.getProxyEndpoint();

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
    console.log(`docker pull ${this.imageRepoUrl}:${this.imageTag}`);
    await ssh.exec(`docker pull ${this.imageRepoUrl}:${this.imageTag}`);

    // 4. Stop and remove existing container if it exists
    console.log('Stopping existing container...');
    try {
      await ssh.exec('docker stop auto-trader || true');
    } catch (error) {
      // ignore if container does not exist
    }
    try {
      await ssh.exec('docker rm auto-trader || true');
    } catch (error) {
      // ignore if container does not exist
    }

    // 5. Run the new container
    console.log('Starting new container...');
    await ssh.exec(`docker run -d --name auto-trader -p 3000:3000 ${this.imageRepoUrl}:${this.imageTag}`);

    console.log('Container deployed successfully!');

  }

}