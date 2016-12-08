import { Route } from '@angular/router';
import { PlaygroundComponent } from './index';
import { AuthGuard } from '../../shared/index';

export const PlaygroundRoutes: Route[] = [
    {
        path: 'playground',
        component: PlaygroundComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    }
];
