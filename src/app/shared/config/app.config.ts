export interface AppConfig {
    API?: string;
    ENV?: string;
}

const appConfig: AppConfig = JSON.parse('<%= APP_CONFIG %>');

export default appConfig;
