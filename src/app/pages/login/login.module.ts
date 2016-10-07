import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import {APIService} from '../../shared/services/api/index';

@NgModule({
    imports: [CommonModule, ReactiveFormsModule],
    declarations: [LoginComponent],
    exports: [LoginComponent],
    providers: [APIService]
})
export class LoginModule { }
