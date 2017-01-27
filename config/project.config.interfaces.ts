export interface InjectableDependency {
    src: string;
    inject: string | boolean;
    vendor?: boolean;
    env?: string[] | string;
}

export interface Environments {
    DEVELOPMENT: string;
    UAT: string;
    PRODUCTION: string;
    [key: string]: string;
}
