import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/index';
import { MenuItem } from 'primeng/primeng';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'biosys-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: []
})
export class NavbarComponent implements OnInit {
    public items: MenuItem[];

    constructor(public auth: AuthService, private router: Router) {
    }

    ngOnInit() {
        this.items = [
            {
                label: 'Home',
                icon: 'fa-home',
                routerLink: ['/']
            },
            {
                label: 'Manage',
                icon: 'fa-university',
                routerLink: ['management/projects']
            },
            {
                label: 'Data',
                icon: 'fa-database',
                routerLink: ['data/projects']
            },
            {
                label: 'View',
                icon: 'fa-search',
                routerLink: ['view']
            },
            {
                label: 'Logout',
                icon: 'fa-sign-out',
                command: () => this.logout()
            }
        ];
    }

    logout() {
        this.auth.logout().subscribe(
            () => this.router.navigate(['/login'])
        );
    }
}
