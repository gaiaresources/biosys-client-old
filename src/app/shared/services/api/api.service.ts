import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Config} from '../../config/env.config';


/**
 * This class provides the Biosys service.
 */
@Injectable()
export class APIService {
    baseUrl: string;

    /**
     * Creates a new BiosysService with the injected Http.
     * @param {Http} http - The injected Http.
     * @constructor
     */
    constructor(private http: Http) {
        console.log("envConfig", Config);
        this.baseUrl = Config.API;
        if (!this.baseUrl.endsWith('/')) this.baseUrl += '/';
    }

    // private buildOptions(): any {
    //     let headers = new Headers(
    //         {'Content-Type': 'application/json'},
    //         {'Accept': 'application/json'}
    //     );
    // }

    public getProjects(): Observable<string[]> {
        let headers = new Headers({'Content-Type': 'application/json'},);
        return this.http.get(this.baseUrl + 'projects')
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    // public authenticate(user: string, password: string): Observable<any> {
    //
    // }

    /**
     * Handle HTTP error
     */
    private handleError(error: any) {
        // console.log('error', error);
        // // In a real world app, we might use a remote logging infrastructure
        // // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
