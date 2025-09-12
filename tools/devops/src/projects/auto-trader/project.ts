import path from 'path';
import { DevopsConfigs } from '@trading-bot/configs';
import DevopsProject from '../DevopsProject';
import awsContainerDeploy from '../../methods/aws/aws-container-deploy';
import awsImageDeploy from '../../methods/aws/aws-image-deploy';
import awsGetImageRepoUrl from '../../methods/aws/aws-get-image-repo-url';

export default class AutoTraderProject extends DevopsProject {

  constructor() {
    super();
    this.name = 'auto-trader';
    this.imageName = 'auto-trader';
    this.imageTag = 'latest';
    this.dockerfile = path.join(__dirname, '..', '..', '..', '..', '..', 'apps', 'auto-trader', 'Dockerfile');
    this.configProvider = new DevopsConfigs();
  }

  getImageRepoUrl = awsGetImageRepoUrl.bind(this);

  getContainerRunScript() {
    const dbHost = this.configProvider.get('DB_HOST');
    const dbPort = this.configProvider.get('DB_PORT');
    const dbUser = this.configProvider.get('DB_USER');
    const dbPassword = this.configProvider.get('DB_PASSWORD');
    const dbName = this.configProvider.get('DB_NAME');

    return [
      `export DB_HOST=${dbHost}`,
      `export DB_PORT=${dbPort}`,
      `export DB_USER=${dbUser}`,
      `export DB_PASSWORD=${dbPassword}`,
      `export DB_NAME=${dbName}`,
      [
        'docker run -d',
        '--name auto-trader',
        '-e DB_HOST=$DB_HOST',
        '-e DB_PORT=$DB_PORT',
        '-e DB_USER=$DB_USER',
        '-e DB_PASSWORD=$DB_PASSWORD',
        '-e DB_NAME=$DB_NAME',
        `${this.getImageRepoUrl()}:${this.imageTag}`
      ].join(' ')
    ].join(' && ');
  }

  public containerDeploy = awsContainerDeploy.bind(this);

  public imageDeploy = awsImageDeploy.bind(this);

  public async deploy() {
    await this.imageDeploy();
    await this.containerDeploy();
  }
}
