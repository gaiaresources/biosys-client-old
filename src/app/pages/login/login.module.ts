import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "./login.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../../shared/services/index";

@NgModule({
    imports: [CommonModule, ReactiveFormsModule],
    declarations: [LoginComponent],
    exports: [LoginComponent],
    providers: [AuthService]
})
export class LoginModule {
}
