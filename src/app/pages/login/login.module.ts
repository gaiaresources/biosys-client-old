import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/index';
import {PanelModule, MessagesModule, InputTextModule, ButtonModule} from 'primeng/primeng';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        PanelModule,
        MessagesModule,
        InputTextModule,
        ButtonModule],
    declarations: [LoginComponent],
    exports: [LoginComponent],
    providers: [AuthService]
})
export class LoginModule {
}
