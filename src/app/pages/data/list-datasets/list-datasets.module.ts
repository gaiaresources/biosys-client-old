import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ListDatasetsComponent } from './list-datasets.component';
import { APIService } from '../../../shared/services/api/index';
import { DataTableModule, DialogModule, ButtonModule } from 'primeng/primeng';

@NgModule({
    imports: [CommonModule, SharedModule, DataTableModule, DialogModule, ButtonModule],
    declarations: [ListDatasetsComponent],
    exports: [ListDatasetsComponent],
    providers: [APIService]
})
export class ListDatasetsModule {
}
