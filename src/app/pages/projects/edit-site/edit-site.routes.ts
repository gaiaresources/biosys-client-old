import { Route } from '@angular/router';
import { EditSiteComponent } from './index';
import { AuthGuard } from '../../../shared/index';

export const EditSiteRoutes: Route[] = [
    {
        path: 'projects/edit-project/:projId/create-site',
        component: EditSiteComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    },
    {
        path: 'projects/edit-project/:projId/edit-site/:id',
        component: EditSiteComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    }
];
