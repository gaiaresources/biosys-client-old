import { Route } from '@angular/router';
import { ListDatasetsComponent } from './index';
import { AuthGuard } from '../../../shared/index';

export const DatasetsRoutes: Route[] = [
    {
        path: 'data/projects/:projId/datasets',
        component: ListDatasetsComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    }
];
