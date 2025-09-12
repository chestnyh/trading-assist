export default function awsGetImageRepoUrl() {
    const awsEcrAccountId = this.configProvider.get('AWS_ECR_ACCOUNT_ID');
    const awsEcrRegion = this.configProvider.get('AWS_ECR_REGION');
    const awsEcrRepoNamespace = this.configProvider.get('AWS_ECR_REPO_NAMESPACE');
    return `${awsEcrAccountId}.dkr.ecr.${awsEcrRegion}.amazonaws.com/${awsEcrRepoNamespace}/${this.imageName}`;
}