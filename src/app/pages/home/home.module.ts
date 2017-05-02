import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
//import { AngularOpenlayersModule } from 'angular2-openlayers';
import { LeafletModule } from '@asymmetrik/angular2-leaflet';
import { APIService } from '../../shared/services/api/index';

@NgModule({
    imports: [CommonModule, SharedModule.forRoot(), LeafletModule],
    declarations: [HomeComponent],
    providers: [APIService]
})
export class HomeModule { }
