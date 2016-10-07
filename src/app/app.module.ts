import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

import { HomeModule } from './pages/home/home.module';
import { SharedModule } from './shared/shared.module';
import { PlaygroundModule } from './pages/playground/index';
import { AuthGuard } from './shared/auth.guard';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot(routes),
        HomeModule,
        SharedModule.forRoot(),
        PlaygroundModule
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
