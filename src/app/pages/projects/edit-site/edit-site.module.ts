import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { EditSiteComponent } from './edit-site.component';
import { APIService } from '../../../shared/services/api/index';
import { DialogModule, ButtonModule } from 'primeng/primeng';
import { JSONEditorModule } from '../../../shared/index';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DialogModule,
        ButtonModule,
        JSONEditorModule,
    ],
    declarations: [EditSiteComponent],
    exports: [EditSiteComponent],
    providers: [APIService]
})
export class EditSiteModule {
}
