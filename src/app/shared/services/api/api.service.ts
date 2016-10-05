import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, Request, URLSearchParams, ResponseContentType } from '@angular/http';
import { Observable, Observer } from 'rxjs';
import appConfig from '../../config/app.config';


export interface APIError {
    status: number;
    statusText: string;
    msg: string;
}

export interface FetchOptions {
    method?: string;
    headers?: {[key: string]: string};
    urlParams?: {[key: string]: string};
    data?: {[key: string]: string};
    map?: (resp: any) => any;
}

/**
 * This class provides the Biosys service.
 */
@Injectable()
export class APIService {
    static authToken: string = null;
    baseUrl: string;

    /**
     * Handle HTTP error
     */
    private static handleError(res: Response) {
        let error: APIError = {
            status: res.status,
            statusText: res.statusText,
            msg: res.text()
        };
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


    public authenticate(username: string, password: string): Observable<string> {
        // fetch token and set it.
        return Observable.create((observer: Observer<string>) => {
            let obs = this.getAuthToken(username, password);
            obs.subscribe(
                token => {
                    // set the token
                    APIService.authToken = token;
                    observer.next(token);
                    observer.complete();
                },
                error => observer.error(error)
            );
        });
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

    public getAllProjects(): Observable<any[]> {
        return this.fetch('projects', {});
    }
    public getProject(id: number): Observable<any[]> {
        return this.fetch('projects/' + id, {});
    }
    public fetch(path: string, options: FetchOptions): Observable<any> {
        if (path && !path.endsWith('/')) {
            // enforce '/' at the end
            path += '/';
        }
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        if (APIService.authToken) {
            headers.append('Authorization', 'Token ' + APIService.authToken);
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
