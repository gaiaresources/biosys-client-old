import { Injectable } from '@angular/core';
import { APIService, APIError } from './index';
import { Observable, Observer } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';

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
        let localLogout = () => {
            localStorage.removeItem('auth_token');
            Cookie.deleteAll();
            this.hasAuthToken = false;
        };
        return Observable.create((observer: Observer<boolean>) => {
            this.api.logout().subscribe(
                () => {
                    localLogout();
                    observer.next(true);
                    observer.complete();
                },
                (error: APIError) => {
                    console.log('error.msg', error.msg);
                    localLogout();
                    observer.next(true);
                    observer.complete();
                }
            );
        });
    }

    isLoggedIn() {
        return true;
    }

}
