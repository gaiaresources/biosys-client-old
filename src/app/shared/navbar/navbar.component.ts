import { Component } from "@angular/core";
import { AuthService } from "../services/index";
import { Router } from "@angular/router";

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
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}
