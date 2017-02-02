import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { ManagementListProjectsComponent } from './list-projects.component';
import { APIService } from '../../../shared/services/api/index';
import { ConfirmationService, DataTableModule, DialogModule, ButtonModule, GrowlModule,
    ConfirmDialogModule } from 'primeng/primeng';

@NgModule({
    imports: [CommonModule, SharedModule, DataTableModule, DialogModule, ButtonModule, GrowlModule,
        ConfirmDialogModule],
    declarations: [ManagementListProjectsComponent],
    exports: [ManagementListProjectsComponent],
    providers: [APIService, ConfirmationService]
})
export class ManagementListProjectsModule {
}
