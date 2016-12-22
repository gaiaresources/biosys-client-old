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
import * as projects from './pages/projects/index';
import * as data from './pages/data/index';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot(routes),
        SharedModule,
        LoginModule,
        HomeModule,
        PlaygroundModule,
        projects.ProjectsModule,
        projects.EditProjectModule,
        projects.EditDatasetModule,
        projects.UploadSitesModule,
		projects.EditSiteModule,
        data.DataModule,
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
