import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/index';
import { NavbarComponent } from './navbar/index';
import { BreadcrumbsComponent } from './breadcrumbs/index';
import { FeatureMapComponent, MarkerDirective } from './featuremap/index';
import { TruncatePipe } from './pipes/index';
import { APIService } from './services/api/index';
import { MenubarModule, BreadcrumbModule } from 'primeng/primeng';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, MenubarModule, BreadcrumbModule],
  declarations: [HeaderComponent, NavbarComponent, BreadcrumbsComponent, FeatureMapComponent, MarkerDirective, TruncatePipe],
  exports: [CommonModule, FormsModule, RouterModule, HeaderComponent, NavbarComponent, BreadcrumbsComponent,
      FeatureMapComponent, MarkerDirective, TruncatePipe]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [APIService]
    };
  }
}
