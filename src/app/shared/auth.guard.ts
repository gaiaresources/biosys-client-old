import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { APIService } from './index';

@Injectable()
export class AuthGuard implements CanActivate {
    api: APIService;
    router: Router;
    constructor(router: Router, api: APIService) {
        this.router = router;
        this.api = api;
    }

    canActivate() {
        if (!this.api.isAuthenticated()) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
}
