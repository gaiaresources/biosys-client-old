import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
import { StatisticsComponent } from './statistics.component';
import { GMapModule } from 'primeng/primeng';
import { AgmCoreModule } from 'angular2-google-maps/core/';
import {APIService} from '../../shared/services/api/index';

@NgModule({
    imports: [CommonModule, SharedModule.forRoot(), AgmCoreModule, GMapModule],
    declarations: [HomeComponent, StatisticsComponent],
    providers: [APIService]
})
export class HomeModule { }
