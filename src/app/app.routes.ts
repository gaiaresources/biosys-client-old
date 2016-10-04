import {Routes} from '@angular/router';
import {PlaygroundRoutes} from './pages/playground/index';
import {HomeRoutes} from './pages/home/index';

export const routes: Routes = [
    ...HomeRoutes,
    ...PlaygroundRoutes
];
