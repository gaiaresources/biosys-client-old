import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ManageDataComponent } from './manage-data.component';
import { APIService } from '../../../shared/services/api/index';
import { ConfirmationService, DataTableModule, DialogModule, ButtonModule, GrowlModule, MessagesModule,
    ConfirmDialogModule, CalendarModule, DropdownModule, FileUploadModule, CheckboxModule } from 'primeng/primeng';

@NgModule({
    imports: [CommonModule, SharedModule, DataTableModule, DialogModule, ButtonModule, GrowlModule, MessagesModule,
        ConfirmDialogModule, CalendarModule, DropdownModule, FileUploadModule, CheckboxModule],
    declarations: [ManageDataComponent],
    exports: [ManageDataComponent],
    providers: [APIService, ConfirmationService]
})
export class ManageDataModule {
}
