export interface APIError {
    status: number;
    statusText: string;
    text: string;
    msg: string | {};
}
export interface FetchOptions {
    method?: string;
    headers?: {[key: string]: string};
    urlParams?: {[key: string]: string};
    data?: any;
    map?: (resp: any) => any;
}

// Biosys remote models
export interface Geometry {
    type: string;
    coordinates: [number, number][];
}
export interface Project {
    id?: number;
    title?: string;
    code?: string;
    timezone?: string;
    datum?: number | string | null;
    attributes?: {[key: string]: string} | null;
    geometry?: Geometry | null;
    site_data_package?: {} | null;
    custodians?: any[] | null;
}
export interface Site {
    id?: number;
    code?: string;
    name?: string;
    parent_site?: number | null;
    project?: number;
    geometry?: Geometry | null;
    comments?: string;
    attributes?: {[key: string]: string} | null;
}
export interface Dataset {
    id?: number;
    name?: string;
    type?: string;
    project?: number;
    data_package?: {};
}
export interface RecordData {
    data: {[key: string]: string} | null;
}
export interface GenericRecord {
    id?: number;
    dataset?: number;
    site?: number | null;
    data?: RecordData;
}
export interface Observation extends GenericRecord {
    datetime?: string;
    geometry?: Geometry;
}
export interface SpeciesObservation extends Observation {
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
