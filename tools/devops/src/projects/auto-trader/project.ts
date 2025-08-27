import path from 'path';
import { ECRClient, GetAuthorizationTokenCommand } from "@aws-sdk/client-ecr";
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
        accessKeyId: devopsConfigs.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: devopsConfigs.get('AWS_SECRET_ACCESS_KEY'),
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

}