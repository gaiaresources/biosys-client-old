import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { EditProjectComponent } from './edit-project.component';
import { APIService } from '../../../shared/services/api/index';
import { ConfirmationService, DataTableModule, DialogModule, ButtonModule, DropdownModule, MultiSelectModule,
    ConfirmDialogModule, GrowlModule }from 'primeng/primeng';

@NgModule({
    imports: [CommonModule, SharedModule, DataTableModule, DialogModule, ButtonModule, DropdownModule,
        MultiSelectModule, ConfirmDialogModule, GrowlModule],
    declarations: [EditProjectComponent],
    exports: [EditProjectComponent],
    providers: [APIService, ConfirmationService]
})
export class EditProjectModule {
}
