import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, Request, URLSearchParams, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs';
import { AuthService } from '../index';
import appConfig from '../../config/app.config';
import { FetchOptions, APIError, User, Project, Dataset, Site, Observation, Statistic, ModelChoice } from './api.interfaces';


/**
 * This class provides the Biosys API service.
 */
@Injectable()
export class APIService {
    baseUrl: string;
    authToken: string;

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
        this.authToken = AuthService.getAuthToken();
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

    public getProjectById(id: number): Observable<Project> {
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

    public getAllObservations(): Observable<Observation[]> {
        return this.fetch('observations', {});
    }

    public getObservationById(id: number): Observable<Observation> {
        return this.fetch('observations' + id, {});
    }

    public createObservation(observation: Observation): Observable<Observation> {
        return this.fetch('observations', {
            method: 'Post',
            data: observation
        });
    }

    public updateObservation(id: number, observation: Observation): Observable<Observation> {
        return this.fetch('observations/' + id, {
            method: 'Patch',
            data: observation
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

    public fetch(path: string, options: FetchOptions): Observable<any> {
        if (path && !path.endsWith('/')) {
            // enforce '/' at the end
            path += '/';
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        if (this.authToken) {
            headers.append('Authorization', 'Token ' + this.authToken);
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
            withCredentials: false,
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
