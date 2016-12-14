import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { LoginModule } from './pages/login/login.module';
import { HomeModule } from './pages/home/home.module';
import { PlaygroundModule } from './pages/playground/index';
import { AuthGuard } from './shared/auth.guard';
import { SharedModule } from './shared/shared.module';
import { AgmCoreModule } from 'angular2-google-maps/core/';
import { ProjectsModule, EditProjectModule, EditDatasetModule } from "./pages/projects/index";

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot(routes),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAYayRKr-lwM6nsfuTeZFT8iApt_XhoclQ'
        }),
        SharedModule,
        LoginModule,
        HomeModule,
        PlaygroundModule,
        ProjectsModule,
        EditProjectModule,
        EditDatasetModule
    ],
    declarations: [AppComponent],
    providers: [
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        },
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
