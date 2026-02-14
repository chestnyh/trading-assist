import * as dotenv from 'dotenv';
import { Configs } from "./configs";

/**
 * TODO add description
 */
export class DevopsConfigs extends Configs {
  constructor() {
    super();
    dotenv.config({ path: './.env.devops' });
    this.configs = {
      ...this.configs,
      AWS_ECR_REGION: process.env['AWS_ECR_REGION'],
      AWS_ECR_ACCOUNT_ID: process.env['AWS_ECR_ACCOUNT_ID'],
      AWS_ECR_REPO_NAMESPACE: process.env['AWS_ECR_REPO_NAMESPACE'],
      AWS_ECR_ACCESS_KEY_ID: process.env['AWS_ECR_ACCESS_KEY_ID'],
      AWS_ECR_SECRET_ACCESS_KEY: process.env['AWS_ECR_SECRET_ACCESS_KEY'],

      AWS_EC2_SSH_HOST:process.env['AWS_EC2_SSH_HOST'],
      AWS_EC2_SSH_USER:process.env['AWS_EC2_SSH_USER'],
      AWS_EC2_SSH_PORT:process.env['AWS_EC2_SSH_PORT'],
      AWS_EC2_SSH_PEM_PATH:process.env['AWS_EC2_SSH_PEM_PATH'],

      DB_USER: process.env['DB_USER'],
      DB_PASSWORD: process.env['DB_PASSWORD'],
      DB_HOST: process.env['DB_HOST'],
      DB_PORT: process.env['DB_PORT'],
      DB_NAME: process.env['DB_NAME'],
      DB_MIGRATION_USER: process.env['DB_MIGRATION_USER'],
      DB_MIGRATION_PASSWORD: process.env['DB_MIGRATION_PASSWORD'],
    };
  }
}