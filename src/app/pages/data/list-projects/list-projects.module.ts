import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { DataListProjectsComponent } from './list-projects.component';
import { APIService } from '../../../shared/services/api/index';
import { DataTableModule, DialogModule, ButtonModule } from 'primeng/primeng';

@NgModule({
    imports: [CommonModule, SharedModule, DataTableModule, DialogModule, ButtonModule],
    declarations: [DataListProjectsComponent],
    exports: [DataListProjectsComponent],
    providers: [APIService]
})
export class DataListProjectsModule {
}
