import * as dotenv from 'dotenv';
import { Configs } from "./configs";
dotenv.config({ path: './.env.devops' });

/**
 * TODO add description
 */
export class DevopsConfigs extends Configs {
  constructor() {
    super();
    this.configs = {
      AWS_ECR_REGION: process.env['AWS_ECR_REGION'],
      AWS_ECR_ACCOUNT_ID: process.env['AWS_ECR_ACCOUNT_ID'],
      AWS_ECR_REPO_NAMESPACE: process.env['AWS_ECR_REPO_NAMESPACE'],
      AWS_ECR_ACCESS_KEY_ID: process.env['AWS_ECR_ACCESS_KEY_ID'],
      AWS_ECR_SECRET_ACCESS_KEY: process.env['AWS_ECR_SECRET_ACCESS_KEY'],
    };
  }
}