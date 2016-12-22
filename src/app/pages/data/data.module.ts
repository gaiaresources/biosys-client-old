import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DataComponent } from './data.component';
import { APIService } from '../../shared/services/api/index';
import { DataTableModule, DialogModule, ButtonModule } from 'primeng/primeng';

@NgModule({
    imports: [CommonModule, SharedModule, DataTableModule, DialogModule, ButtonModule],
    declarations: [DataComponent],
    exports: [DataComponent],
    providers: [APIService]
})
export class DataModule {
}
