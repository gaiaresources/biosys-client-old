import { Route } from '@angular/router';
import { DataListProjectsComponent } from './index';
import { AuthGuard } from '../../../shared/index';
import { DatasetsRoutes } from '../list-datasets/list-datasets.routes';
import { ManageDataRoutes } from '../manage-data/manage-data.routes';
import { EditRecordRoutes } from '../edit-record/edit-record.routes';

export const DataListProjectsRoutes: Route[] = [
    {
        path: 'data/projects',
        component: DataListProjectsComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    },
    ...DatasetsRoutes,
    ...ManageDataRoutes,
    ...EditRecordRoutes
];
