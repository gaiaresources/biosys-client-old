import { Routes } from '@angular/router';
import { LoginRoutes } from './pages/login/index';
import { HomeRoutes } from './pages/home/index';
import { ManagementListProjectsRoutes } from './pages/management/list-projects/list-projects.routes';
import { DataListProjectsRoutes } from './pages/data/list-projects/list-projects.routes';

export const routes: Routes = [
    ...LoginRoutes,
    ...HomeRoutes,
    ...ManagementListProjectsRoutes,
    ...DataListProjectsRoutes
];
