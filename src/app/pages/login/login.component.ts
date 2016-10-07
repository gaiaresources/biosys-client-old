import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Http, Headers } from '@angular/http';
import { APIService, APIError, Project } from '../../shared/index';

@Component({
    moduleId: module.id,
    selector: 'login',
    templateUrl: 'login.component.html'
})
export class LoginComponent {
    private loginForm: FormGroup;
    private username: AbstractControl;
    private password: AbstractControl;

    private apiService: APIService;
    private router: Router;

    constructor(fb: FormBuilder, apiService:APIService, router: Router) {
        this.apiService = apiService;
        this.router = router;

        this.loginForm = fb.group({
            username: ["", Validators.required],
            password: ["", Validators.required]
        });

        this.username = this.loginForm.controls['username'];
        this.password = this.loginForm.controls['password'];
    }

    login(event) {
        event.preventDefault();

        console.log(this.loginForm.value);

        this.apiService.authenticate(this.loginForm.value.username, this.loginForm.value.password)
        .subscribe(
            () => this.router.navigate(['/']),
            (error: APIError) => {
                
                //error.msg
            }
        );

        event.preventDefault();
    }
}