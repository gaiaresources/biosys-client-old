import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { EditDatasetComponent } from './edit-dataset.component';
import { APIService } from '../../../shared/services/api/index';
import { InputTextModule, ButtonModule, DropdownModule, GrowlModule, ConfirmDialogModule,
    ConfirmationService } from 'primeng/primeng';
import { JSONEditorModule } from '../../../shared/index';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        InputTextModule,
        ButtonModule,
        DropdownModule,
        GrowlModule,
        ConfirmDialogModule,
        JSONEditorModule,
    ],
    declarations: [EditDatasetComponent],
    exports: [EditDatasetComponent],
    providers: [APIService, ConfirmationService]
})
export class EditDatasetModule {
}
