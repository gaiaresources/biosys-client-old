import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {EditProjectComponent} from './edit-project.component';
import {APIService} from '../../../shared/services/api/index';
import {DataTableModule, DialogModule, ButtonModule} from 'primeng/primeng';

@NgModule({
    imports: [CommonModule, SharedModule, DataTableModule, DialogModule, ButtonModule],
    declarations: [EditProjectComponent],
    exports: [EditProjectComponent],
    providers: [APIService]
})
export class EditProjectModule {
}
