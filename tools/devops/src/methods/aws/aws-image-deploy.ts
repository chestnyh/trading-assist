
import { execSync } from 'child_process';
import { awsGetECRCredentials } from './helpers';

export default async function awsImageDeploy() {

    const { username, password, proxyEndpoint } = await awsGetECRCredentials(this.configProvider);

    const imageName = this.imageName;
    const imageTag = this.imageTag;
    const imageRepoUrl = this.getImageRepoUrl();
    const dockerfile = this.dockerfile;

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