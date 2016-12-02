import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { APP_BASE_HREF } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";
import { AppComponent } from "./app.component";
import { routes } from "./app.routes";
import { LoginModule } from "./pages/login/login.module";
import { HomeModule } from "./pages/home/home.module";
import { PlaygroundModule } from "./pages/playground/index";
import { AuthGuard } from "./shared/auth.guard";
import { SharedModule } from "./shared/shared.module";

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot(routes),
        LoginModule,
        HomeModule,
        PlaygroundModule,
        SharedModule
    ],
    declarations: [AppComponent],
    providers: [
        {
            provide: APP_BASE_HREF,
            useValue: '<%= APP_BASE %>'
        },
        AuthGuard
    ],
    bootstrap: [AppComponent]

})

export class AppModule {
}
