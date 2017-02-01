import { Route } from '@angular/router';
import { EditDatasetComponent } from './index';
import { AuthGuard } from '../../../shared/index';

export const EditDatasetRoutes: Route[] = [
    {
        path: 'management/projects/edit-project/:projId/create-dataset',
        component: EditDatasetComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    },
    {
        path: 'management/projects/edit-project/:projId/edit-dataset/:id',
        component: EditDatasetComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    }
];
