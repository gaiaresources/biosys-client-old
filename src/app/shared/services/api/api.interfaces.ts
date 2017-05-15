export interface APIError {
    status: number;
    statusText: string;
    text: string;
    msg: any;
}
export interface FetchOptions {
    method?: string;
    headers?: {[key: string]: string};
    urlParams?: {[key: string]: string};
    data?: any;
    map?: (resp: any) => any;
}
export interface User {
    id?: number;
    last_login?: string;
    is_superuser?: boolean;
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    is_staff?: boolean;
    is_active?: boolean;
    date_joined?: string;
    groups?: any[] | null;
    user_permissions?: any[] | null;
}
export interface Project {
    id?: number;
    title?: string;
    code?: string;
    timezone?: string;
    datum?: number | string | null;
    attributes?: {[key: string]: string} | null;
    comments?: string;
    geometry?: GeoJSON.DirectGeometryObject | null;
    centroid?: GeoJSON.DirectGeometryObject | null;
    site_data_package?: {} | null;
    custodians?: number[];
    dataset_count?: number;
    site_count?: number;
    record_count?: number;
}
export interface Site {
    id?: number;
    code?: string;
    name?: string;
    parent_site?: number | null;
    project?: number;
    geometry?: GeoJSON.DirectGeometryObject | null;
    centroid?: GeoJSON.DirectGeometryObject | null;
    comments?: string;
    attributes?: {[key: string]: string} | null;
}
export interface Dataset {
    id?: number;
    name?: string;
    type?: string;
    project?: number;
    data_package?: {
        'resources'?: any[]
    };
    record_count?: number;
}
export interface Record {
    id?: number;
    dataset?: number;
    site?: number | null;
    source_info: any;
    last_modified?: string;
    created?: string;
    data?: {[key: string]: any} | null;
    datetime?: string;
    geometry?: GeoJSON.DirectGeometryObject | null;
    species_name?: string;
    name_id?: number;
}
export interface Statistic {
    projects: any;
    datasets: any[];
    records: any[];
    // sites: number;
}
export interface ModelChoice {
    display_name: string;
    value: string | number;
}
