import { DevopsConfigs } from "@trading-bot/configs";
import { ECRClient, GetAuthorizationTokenCommand } from "@aws-sdk/client-ecr";

export default async function getECRCredentials(configProvider: DevopsConfigs) {

    const ecrClient = new ECRClient({
        region: configProvider.get('AWS_ECR_REGION') as string,
        credentials: {
            accessKeyId: configProvider.get('AWS_ECR_ACCESS_KEY_ID') as string,
            secretAccessKey: configProvider.get('AWS_ECR_SECRET_ACCESS_KEY') as string,
        }
    });

    console.log('Authenticating Docker to AWS ECR using @aws-sdk/client-ecr...');
    const authCommand = new GetAuthorizationTokenCommand({
        registryIds: [configProvider.get('AWS_ECR_ACCOUNT_ID') as string],
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
    return {
        username,
        password,
        proxyEndpoint
    }

}