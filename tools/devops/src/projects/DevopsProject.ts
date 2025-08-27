export default class DevopsProject {

    protected name: string;
    protected imageName: string;
    protected imageTag: string;
    protected username: string;
    protected password: string;
    protected proxyEndpoint: string;
    protected dockerfile: string;
  
    get imageRepoUrl(): string {
        throw new Error('Not implemented');
    };

    async getUsername(): Promise<string> {
        throw new Error('Not implemented');
    }

    async getPassword(): Promise<string> {
        throw new Error('Not implemented');
    }

    async getProxyEndpoint(): Promise<string> {
        throw new Error('Not implemented');
    }

    async getDockerfile() {
        return this.dockerfile;
    }
      
}