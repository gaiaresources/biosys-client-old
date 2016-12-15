import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { EditDatasetComponent } from './edit-dataset.component';
import { APIService } from '../../../shared/services/api/index';
import { DialogModule, ButtonModule } from 'primeng/primeng';
import { JSONEditorModule } from 'ng2-jsoneditor';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DialogModule,
        ButtonModule,
    ],
    declarations: [EditDatasetComponent],
    exports: [EditDatasetComponent],
    providers: [APIService]
})
export class EditDatasetModule {
}
