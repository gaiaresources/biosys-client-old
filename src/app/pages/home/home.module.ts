import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
import { APIService } from '../../shared/services/api/index';

@NgModule({
    imports: [CommonModule, SharedModule.forRoot()],
    declarations: [HomeComponent],
    providers: [APIService]
})
export class HomeModule { }
