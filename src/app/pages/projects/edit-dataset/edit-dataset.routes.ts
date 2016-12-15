import { Route } from '@angular/router';
import { EditDatasetComponent } from './index';
import { AuthGuard } from '../../../shared/index';

export const EditDatasetRoutes: Route[] = [
    {
        path: 'projects/:projId/create-dataset',
        component: EditDatasetComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    },
    {
        path: 'projects/edit-dataset/:id',
        component: EditDatasetComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    }
];
