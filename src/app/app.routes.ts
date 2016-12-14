import { Routes } from '@angular/router';
import { PlaygroundRoutes } from './pages/playground/index';
import { LoginRoutes } from './pages/login/index';
import { HomeRoutes } from './pages/home/index';
import { ProjectsRoutes } from "./pages/projects/projects.routes";
import {EditProjectRoutes} from "./pages/projects/edit-project/edit-project.routes";

export const routes: Routes = [
    ...LoginRoutes,
    ...HomeRoutes,
    ...PlaygroundRoutes,
    ...ProjectsRoutes,
    ...EditProjectRoutes
];
