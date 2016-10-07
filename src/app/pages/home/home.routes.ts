import { Route } from '@angular/router';
import { HomeComponent } from './index';
import { AuthGuard } from '../../shared/index';

export const HomeRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  }
];
