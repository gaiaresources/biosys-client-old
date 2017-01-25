import { Route } from '@angular/router';
import { ManageDataComponent } from './index';
import { AuthGuard } from '../../../shared/index';

export const ManageDataRoutes: Route[] = [
    {
        path: 'data/projects/:projId/datasets/:datasetId',
        component: ManageDataComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    }
];
