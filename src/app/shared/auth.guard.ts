import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/index';

@Injectable()
export class AuthGuard implements CanActivate {
    private auth: AuthService;
    private router: Router;

    constructor(router: Router, auth: AuthService) {
        this.router = router;
        this.auth = auth;
    }

    canActivate() {
        if (!this.auth.isLoggedIn()) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
}
