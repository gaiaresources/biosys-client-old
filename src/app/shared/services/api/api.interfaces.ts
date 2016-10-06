export interface APIError {
    status: number;
    statusText: string;
    msg: string;
}

export interface FetchOptions {
    method?: string;
    headers?: {[key: string]: string};
    urlParams?: {[key: string]: string};
    data?: any;
    map?: (resp: any) => any;
}


// remote models
export interface Geometry {
    type: string;
    coordinates: [number, number][];
}

export interface Project {
    id?: number;
    title?: string;
    code?: string | null;
    timezone?: string;
    datum?: number | string | null;
    attributes?: {[key: string]: string} | null;
    geometry?: Geometry;
    site_data_package?: {} | null;
    custodians?: any[];
}
