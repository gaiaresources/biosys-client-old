import { Injectable } from '@angular/core';
import { APIService } from './index';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class AuthService {
    private api: APIService;
    private hasAuthToken = false;

    static getAuthToken() {
        return localStorage.getItem('auth_token');
    }

    constructor(api: APIService) {
        this.hasAuthToken = !!localStorage.getItem('auth_token');
        this.api = api;
    }

    login(username: string, password: string) {
        return this.api.getAuthToken(username, password)
            .map(token => {
                // set the token
                localStorage.setItem('auth_token', token);
                this.hasAuthToken = true;
            });
    }

    logout() {
        return Observable.create((observer: Observer<boolean>) => {
            localStorage.removeItem('auth_token');
            this.hasAuthToken = false;
            observer.next(true);
            observer.complete();
        });
    }

    isLoggedIn() {
        return true;
    }

}
