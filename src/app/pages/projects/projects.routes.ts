import { Route } from '@angular/router';
import { ProjectsComponent } from './index';
import { AuthGuard } from '../../shared/index';

export const ProjectsRoutes: Route[] = [
    {
        path: 'projects',
        component: ProjectsComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard]
    }
];
