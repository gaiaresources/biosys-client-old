import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, Request, URLSearchParams, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';
import { AuthService } from '../index';
import appConfig from '../../config/app.config';
import { FetchOptions, APIError, User, Project, Dataset, Site, GenericRecord, Observation, SpeciesObservation, Statistic, ModelChoice } from './api.interfaces';


/**
 * This class provides the Biosys API service.
 */
@Injectable()
export class APIService {
    baseUrl: string;

    /**
     * Handle HTTP error
     */
    private static handleError(res: Response) {
        let error: APIError = {
            status: res.status,
            statusText: res.statusText,
            text: res.text(),
            msg: ''
        };
        // The error message is usually in the body as 'detail' or 'non_field_errors'
        let body = res.json();
        if ('detail' in body) {
            error.msg = body['detail'];
        } else if ('non_field_errors' in body) {
            error.msg = body['non_field_errors'];
        } else {
            error.msg = body;
        }
        return Observable.throw(error);
    }

    /**
     * Creates a new APIService with the injected Http.
     * @param {Http} http - The injected Http.
     * @constructor
     */
    constructor(private http: Http) {
        this.baseUrl = appConfig.API;
        if (!this.baseUrl.endsWith('/')) this.baseUrl += '/';
    }

    public getAuthToken(username: string, password: string): Observable<string> {
        return this.fetch('auth-token', {
            method: 'Post',
            data: {
                username: username,
                password: password
            },
            map: (res) => res.token
        });
    }

    public getUsers(): Observable<User[]> {
        return this.fetch('users', {});
    }

    public getAllProjects(): Observable<Project[]> {
        return this.fetch('projects', {});
    }

    public getProjectById(id: Number): Observable<Project> {
        return this.fetch('projects/' + id, {});
    }

    public createProject(project: Project): Observable<Project> {
        return this.fetch('projects', {
            method: 'Post',
            data: project
        });
    }

    public updateProject(project: Project): Observable<Project> {
        return this.fetch('projects/' + project.id, {
            method: 'Patch',
            data: project
        });
    }

    public getAllSites(): Observable<Site[]> {
        return this.fetch('sites', {});
    }

    public getAllSitesForProjectID(id: Number): Observable<Site[]> {
        return this.fetch('projects/' + id + '/sites', {});
    }

    public getSiteById(id: number): Observable<Site> {
        return this.fetch('sites/' + id, {});
    }

    public createSite(site: Site): Observable<Site> {
        return this.fetch('sites/', {
            method: 'Post',
            data: site
        });
    }

    public updateSite(site: Site): Observable<Site> {
        return this.fetch('sites/' + site.id, {
            method: 'Patch',
            data: site
        });
    }

    public getAllDatasets(): Observable<Dataset[]> {
        return this.fetch('datasets', {});
    }

    public getAllDatasetsForProjectID(id: Number): Observable<Dataset[]> {
        return this.fetch('datasets', {urlParams: {project: String(id)}});
    }

    public getDatasetById(id: Number): Observable<Dataset> {
        return this.fetch('datasets/' + id, {});
    }

    public createDataset(dataset: Dataset): Observable<Dataset> {
        return this.fetch('datasets', {
            method: 'Post',
            data: dataset
        });
    }

    public updateDataset(dataset: Dataset): Observable<Dataset> {
        return this.fetch('datasets/' + dataset.id, {
            method: 'Patch',
            data: dataset
        });
    }

    public getDataByDatasetId(id: Number): Observable<any[]> {
        return this.fetch('datasets/' + id + '/data/', {});
    }

    public createDataForDatasetId(id: Number, data: any[]) {
        return this.fetch('datasets/' + id + '/data/', {
            method: 'Post',
            data: data
        });
    }

    public getAllGenericRecords(): Observable<GenericRecord[]> {
        return this.fetch('generic_records', {});
    }

    public getGenericRecordById(id: Number): Observable<GenericRecord> {
        return this.fetch('generic_records' + id, {});
    }

    public createGenericRecord(genericRecord: GenericRecord): Observable<GenericRecord> {
        return this.fetch('generic_records', {
            method: 'Post',
            data: genericRecord
        });
    }

    public updateGenericRecord(id: Number, genericRecord: GenericRecord): Observable<GenericRecord> {
        return this.fetch('generic_records/' + id, {
            method: 'Patch',
            data: genericRecord
        });
    }

    public getAllObservations(): Observable<Observation[]> {
        return this.fetch('observations', {});
    }

    public getObservationById(id: Number): Observable<Observation> {
        return this.fetch('observations' + id, {});
    }

    public createObservation(observation: Observation): Observable<Observation> {
        return this.fetch('observations', {
            method: 'Post',
            data: observation
        });
    }

    public updateObservation(id: Number, observation: Observation): Observable<Observation> {
        return this.fetch('observations/' + id, {
            method: 'Patch',
            data: observation
        });
    }

    public getAllSpeciesObservations(): Observable<SpeciesObservation[]> {
        return this.fetch('species_observations', {});
    }

    public getSpeciesObservationById(id: Number): Observable<SpeciesObservation> {
        return this.fetch('species_observations' + id, {});
    }

    public createSpeciesObservation(speciesObservation: SpeciesObservation): Observable<SpeciesObservation> {
        return this.fetch('species_observations', {
            method: 'Post',
            data: speciesObservation
        });
    }

    public updateSpeciesObservation(id: Number, speciesObservation: SpeciesObservation): Observable<SpeciesObservation> {
        return this.fetch('species_observations/' + id, {
            method: 'Patch',
            data: speciesObservation
        });
    }

    public getStatistics(): Observable<Statistic> {
        return this.fetch('statistics', {});
    }

    public getModelChoices(modelName: string, fieldName: string): Observable<ModelChoice[]> {
        return this.getModelMetadata(modelName)
            .map(
                (metaData) => metaData.actions['POST'][fieldName]['choices']
            );
    }

    public getModelMetadata(modelName: string): Observable<any> {
        return this.fetch(modelName, {
            'method': 'Options'
        });
    }

    public getProjectSiteUploadURL(projectId: number): string {
        return this.baseUrl + 'projects/' + projectId + '/upload-sites/';
    }

    /**
     * Returns an array of [header, value] of headers necessary for authentication
     * @returns {[string,string][]}
     */
    public getAuthHeaders(): [string, string][] {
        let headers: [string, string][] = [];
        let authToken = AuthService.getAuthToken();
        if (authToken) {
            headers.push(['Authorization', 'Token ' + authToken]);
        }
        return headers;
    }

    public fetch(path: string, options: FetchOptions): Observable<any> {
        if (path && !path.endsWith('/')) {
            // enforce '/' at the end
            path += '/';
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        for (let header of this.getAuthHeaders()) {
            headers.append(header[0], header[1]);
        }
        if (options.headers) {
            for (let key in options.headers) {
                headers.append(key, options.headers[key]);
            }
        }
        let searchParams = new URLSearchParams();
        if (options.urlParams) {
            for (let key in options.urlParams) {
                searchParams.append(key, options.urlParams[key]);
            }
        }
        let reqOptions = new RequestOptions({
            url: this.baseUrl + path,
            method: options.method || 'Get',
            headers: headers,
            search: searchParams,
            body: JSON.stringify(options.data),
            withCredentials: true,
            responseType: ResponseContentType.Json
        });
        let request = new Request(reqOptions);
        return this.http.request(request)
            .map((res: Response) => {
                return options.map ? options.map(res.json()) : res.json();
            })
            .catch(APIService.handleError);
    }
}
