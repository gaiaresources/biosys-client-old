import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { EditSiteComponent } from './edit-site.component';
import { APIService } from '../../../shared/services/api/index';
import { InputTextModule, InputTextareaModule, DialogModule, ButtonModule, GrowlModule, ConfirmDialogModule,
    ConfirmationService } from 'primeng/primeng';
import { JSONEditorModule } from '../../../shared/index';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        InputTextModule,
        InputTextareaModule,
        DialogModule,
        ButtonModule,
        GrowlModule,
        ConfirmDialogModule,
        JSONEditorModule,
    ],
    declarations: [EditSiteComponent],
    exports: [EditSiteComponent],
    providers: [APIService, ConfirmationService]
})
export class EditSiteModule {
}
