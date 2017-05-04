import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/index';
import { NavbarComponent } from './navbar/index';
import { BreadcrumbsComponent } from './breadcrumbs/index';
import { FeatureMapComponent } from './featuremap/index';
import { TruncatePipe } from './pipes/index';
import { APIService } from './services/api/index';
import { MenubarModule, BreadcrumbModule } from 'primeng/primeng';
import { LeafletModule } from '@asymmetrik/angular2-leaflet';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, MenubarModule, BreadcrumbModule, LeafletModule],
  declarations: [HeaderComponent, NavbarComponent, BreadcrumbsComponent, FeatureMapComponent, TruncatePipe],
  exports: [CommonModule, FormsModule, RouterModule, HeaderComponent, NavbarComponent, BreadcrumbsComponent,
      FeatureMapComponent, TruncatePipe]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [APIService]
    };
  }
}
