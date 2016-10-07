import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
import { StatisticsComponent } from './statistics.component';

@NgModule({
  imports: [CommonModule, SharedModule.forRoot() ],
  declarations: [HomeComponent, StatisticsComponent],
})
export class HomeModule { }
