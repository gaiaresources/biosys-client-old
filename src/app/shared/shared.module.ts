import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/index';
import { NavbarComponent } from './navbar/index';
import { FeatureMapComponent } from './featuremap/index';
import { TruncatePipe } from './pipes/index';
import { APIService } from './services/api/index';
import { MenubarModule } from 'primeng/primeng';
import { AngularOpenlayersModule } from 'angular2-openlayers';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, MenubarModule, AngularOpenlayersModule],
  declarations: [HeaderComponent, NavbarComponent, FeatureMapComponent, TruncatePipe],
  exports: [CommonModule, FormsModule, RouterModule, HeaderComponent, NavbarComponent, FeatureMapComponent, TruncatePipe]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [APIService]
    };
  }
}
