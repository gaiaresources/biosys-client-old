import { Route } from '@angular/router';
import { EditProjectComponent } from './index';
import { AuthGuard } from '../../../shared/index';

export const EditProjectRoutes: Route[] = [
    {
        path: 'projects/create-project',
        component: EditProjectComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    },
    {
        path: 'projects/edit-project/:id',
        component: EditProjectComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    }
];
