import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../shared/index';

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: 'login.component.html'
})
export class LoginComponent {
    public errorMessages: string[];
    private loginForm: FormGroup;
    private username: AbstractControl;
    private password: AbstractControl;

    private authService: AuthService;
    private router: Router;

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
            () => this.errorMessages = ['Invalid username/password.']
        );

        event.preventDefault();
    }
}
