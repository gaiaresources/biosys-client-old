import { Injectable } from "@angular/core";
import { APIService } from "./index";
import { Observable, Observer } from "rxjs";

@Injectable()
export class AuthService {
    private api: APIService;
    private loggedIn = false;

    static getAuthToken() {
        return localStorage.getItem('auth_token')
    }

    constructor(api: APIService) {
        this.loggedIn = !!localStorage.getItem('auth_token');
        this.api = api;
    }

    login(username: string, password: string) {
        // fetch token and set it.
        return Observable.create((observer: Observer<string>) => {
            let obs = this.api.getAuthToken(username, password);
            obs.subscribe(
                token => {
                    // set the token
                    localStorage.setItem('auth_token', token);
                    this.loggedIn = true;
                    observer.next(token);
                    observer.complete();
                },
                error => observer.error(error)
            );
        });
    }

    logout() {
        localStorage.removeItem('auth_token');
        this.loggedIn = false;
    }

    isLoggedIn() {
        return this.loggedIn;
    }

}
