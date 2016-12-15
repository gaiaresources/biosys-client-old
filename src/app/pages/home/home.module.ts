import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
import { StatisticsComponent } from './statistics.component';
import { AngularOpenlayersModule } from 'angular2-openlayers';
import { APIService } from '../../shared/services/api/index';

@NgModule({
    imports: [CommonModule, SharedModule.forRoot(), AngularOpenlayersModule],
    declarations: [HomeComponent, StatisticsComponent],
    providers: [APIService]
})
export class HomeModule { }
