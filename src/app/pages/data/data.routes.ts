import { Route } from '@angular/router';
import { DataComponent } from './index';
import { AuthGuard } from '../../shared/index';

export const DataRoutes: Route[] = [
    {
        path: 'data',
        component: DataComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    },
];
