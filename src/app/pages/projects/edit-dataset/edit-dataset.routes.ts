import { Route } from '@angular/router';
import { EditDatasetComponent } from './index';
import { AuthGuard } from '../../../shared/index';

export const EditDatasetRoutes: Route[] = [
    {
        path: 'projects/edit-project/:projId/create-dataset',
        component: EditDatasetComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    },
    {
        path: 'projects/edit-project/:projId/edit-dataset/:id',
        component: EditDatasetComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    }
];
