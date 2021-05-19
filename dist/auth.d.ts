interface AckeeAuthConfig {
    endpoint: string;
    username: string;
    password: string;
}
declare type BearerToken = string;
declare type GetBearerToken = (config: AckeeAuthConfig) => Promise<BearerToken>;
export declare const getBearerToken: GetBearerToken;
export {};
