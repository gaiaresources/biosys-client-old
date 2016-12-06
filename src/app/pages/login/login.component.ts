import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { APIError, AuthService } from "../../shared/index";

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: 'login.component.html'
})
export class LoginComponent {
    private loginForm: FormGroup;
    private username: AbstractControl;
    private password: AbstractControl;

    private authService: AuthService;
    private router: Router;

    private errorMessages: String;

    constructor(fb: FormBuilder, authService: AuthService, router: Router) {
        this.authService = authService;
        this.router = router;

        this.loginForm = fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.username = this.loginForm.controls['username'];
        this.password = this.loginForm.controls['password'];
    }

    login(event: any) {
        event.preventDefault();
        this.authService.login(this.loginForm.value.username, this.loginForm.value.password)
        .subscribe(
            () => this.router.navigate(['/']),
            (error: APIError) => {
                this.errorMessages = JSON.parse(error.msg)['non_field_errors'];
            }
        );

        event.preventDefault();
    }
}
