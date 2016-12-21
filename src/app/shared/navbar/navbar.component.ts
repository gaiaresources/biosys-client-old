import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/index';
import { MenubarModule, MenuItem } from 'primeng/primeng';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'biosys-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.css']
})
export class NavbarComponent {
    private items: MenuItem[];

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
                items: [
                    {
                        label: 'Projects',
                        routerLink: ['/projects']
                    },
                    {
                        label: 'Data',
                        routerLink: ['/data']
                    }
                ]
            },
            {
                label: 'View',
                icon: 'fa-search'
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
