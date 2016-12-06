import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/index";

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
    constructor(private auth: AuthService, private router: Router) {
    }

    logout() {
        this.auth.logout().subscribe(
            () => this.router.navigate(['/login'])
        );
    }
}
