import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { EditRecordComponent } from './edit-record.component';
import { APIService } from '../../../shared/services/api/index';
import { ConfirmationService, DataTableModule, DialogModule, ButtonModule, GrowlModule, MessagesModule, InputTextModule,
    ConfirmDialogModule, CalendarModule, DropdownModule, FileUploadModule, CheckboxModule } from 'primeng/primeng';

@NgModule({
    imports: [CommonModule, SharedModule, DataTableModule, DialogModule, ButtonModule, GrowlModule, MessagesModule,
        ConfirmDialogModule, CalendarModule, DropdownModule, FileUploadModule, CheckboxModule, InputTextModule],
    declarations: [EditRecordComponent],
    exports: [EditRecordComponent],
    providers: [APIService, ConfirmationService]
})
export class EditRecordModule {
}
