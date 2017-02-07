import { Route } from '@angular/router';
import { EditRecordComponent } from './index';
import { AuthGuard } from '../../../shared/index';

export const EditRecordRoutes: Route[] = [
    {
        path: 'data/projects/:projId/datasets/:datasetId/create-record',
        component: EditRecordComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    },
    {
        path: 'data/projects/:projId/datasets/:datasetId/record/:recordId',
        component: EditRecordComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    }
];
