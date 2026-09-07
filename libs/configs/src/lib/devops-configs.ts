import { Configs } from "./configs";

/**
 * TODO add description
 */
export class DevopsConfigs extends Configs {
  constructor() {
    super();
    this.configs = {
      ...this.configs,
      AWS_ECR_REGION: this.initialConfig['AWS_ECR_REGION'],
      AWS_ECR_ACCOUNT_ID: this.initialConfig['AWS_ECR_ACCOUNT_ID'],
      AWS_ECR_REPO_NAMESPACE: this.initialConfig['AWS_ECR_REPO_NAMESPACE'],
      AWS_ECR_ACCESS_KEY_ID: this.initialConfig['AWS_ECR_ACCESS_KEY_ID'],
      AWS_ECR_SECRET_ACCESS_KEY: this.initialConfig['AWS_ECR_SECRET_ACCESS_KEY'],

      AWS_EC2_SSH_HOST:this.initialConfig['AWS_EC2_SSH_HOST'],
      AWS_EC2_SSH_USER:this.initialConfig['AWS_EC2_SSH_USER'],
      AWS_EC2_SSH_PORT:this.initialConfig['AWS_EC2_SSH_PORT'],
      AWS_EC2_SSH_PEM_PATH:this.initialConfig['AWS_EC2_SSH_PEM_PATH'],

      DB_USER: this.initialConfig['DB_USER'],
      DB_PASSWORD: this.initialConfig['DB_PASSWORD'],
      DB_HOST: this.initialConfig['DB_HOST'],
      DB_PORT: this.initialConfig['DB_PORT'],
      DB_NAME: this.initialConfig['DB_NAME'],
      DB_MIGRATION_USER: this.initialConfig['DB_MIGRATION_USER'],
      DB_MIGRATION_PASSWORD: this.initialConfig['DB_MIGRATION_PASSWORD'],
    };
  }
}