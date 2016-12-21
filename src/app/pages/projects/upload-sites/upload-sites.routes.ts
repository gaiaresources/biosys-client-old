import { Route } from '@angular/router';
import { UploadSitesComponent } from './upload-sites.component';
import { AuthGuard } from '../../../shared/index';

export const UploadSitesRoutes: Route[] = [
    {
        path: 'projects/edit-project/:projectId/upload-sites',
        component: UploadSitesComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    }
];
