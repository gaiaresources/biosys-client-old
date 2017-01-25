import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { UploadSitesComponent } from './upload-sites.component';
import { APIService } from '../../../shared/services/api/index';
import * as primeng from 'primeng/primeng';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        primeng.MessagesModule,
        primeng.FileUploadModule,
    ],
    declarations: [UploadSitesComponent],
    exports: [UploadSitesComponent],
    providers: [APIService]
})
export class UploadSitesModule {
}
