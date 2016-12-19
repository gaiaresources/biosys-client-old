import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { EditDatasetComponent } from './edit-dataset.component';
import { APIService } from '../../../shared/services/api/index';
import { DialogModule, ButtonModule, DropdownModule } from 'primeng/primeng';
import { JSONEditorModule } from '../../../shared/index';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DialogModule,
        ButtonModule,
        DropdownModule,
        JSONEditorModule,
    ],
    declarations: [EditDatasetComponent],
    exports: [EditDatasetComponent],
    providers: [APIService]
})
export class EditDatasetModule {
}
