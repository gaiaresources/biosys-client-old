import { Routes } from '@angular/router';
import { LoginRoutes } from './pages/login/index';
import { HomeRoutes } from './pages/home/index';
import { ProjectsRoutes } from './pages/projects/projects.routes';

export const routes: Routes = [
    ...LoginRoutes,
    ...HomeRoutes,
    ...ProjectsRoutes
];
