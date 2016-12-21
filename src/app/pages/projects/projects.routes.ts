import { Route } from '@angular/router';
import { ProjectsComponent } from './index';
import { AuthGuard } from '../../shared/index';
import { EditProjectRoutes } from './edit-project/index';
import { EditSiteRoutes } from './edit-site/edit-site.routes';
import { EditDatasetRoutes } from './edit-dataset/index';
import { UploadSitesRoutes } from './upload-sites/index';

export const ProjectsRoutes: Route[] = [
    {
        path: 'projects',
        component: ProjectsComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    },
    ...EditProjectRoutes,
    ...EditSiteRoutes,
    ...EditDatasetRoutes,
    ...UploadSitesRoutes,
];
