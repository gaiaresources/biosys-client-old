import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/index';
import { NavbarComponent } from './navbar/index';
import { APIService } from './services/api/index';
import { MenubarModule } from 'primeng/primeng';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, MenubarModule],
  declarations: [HeaderComponent, NavbarComponent],
  exports: [CommonModule, FormsModule, RouterModule, HeaderComponent, NavbarComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [APIService]
    };
  }
}
