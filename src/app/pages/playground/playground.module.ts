import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {PlaygroundComponent} from './playground.component';
import {APIService} from '../../shared/services/api/index';

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [PlaygroundComponent],
    exports: [PlaygroundComponent],
    providers: [APIService]
})
export class PlaygroundModule {
}
