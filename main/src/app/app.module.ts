import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CommonModule
} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { AgmCoreModule } from '@agm/core';
import { DataTablesModule } from 'angular-datatables';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ToastrModule } from 'ngx-toastr';

import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';


import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

import { VerticalNavigationComponent } from './shared/vertical-header/vertical-navigation.component';
import { VerticalSidebarComponent } from './shared/vertical-sidebar/vertical-sidebar.component';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthInterceptor } from './authentication/login/helpers/auth.interceptor';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NotifierModule } from 'angular-notifier';
import { SafePipe } from './pipes/sanitizer.pipe';
import { PipesModule } from './pipes/pipes.module';
import { AdministracionModule } from './administracion/administracion.module';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function tokenGetter() { 
  return localStorage.getItem("access_token"); 
}


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20
};

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    BlankComponent,
    VerticalNavigationComponent,
    VerticalSidebarComponent,
  ],
  imports: [
    NotifierModule,
    //
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    DataTablesModule,
    HttpClientModule,
    AdministracionModule,
    NgbModule,
    Ng2SearchPipeModule,
    FeatherModule,
    FeatherModule.pick(allIcons),
    RouterModule.forRoot(Approutes),
    PerfectScrollbarModule,
    NgMultiSelectDropDownModule.forRoot(),
    // AgmCoreModule.forRoot({ apiKey: 'AIzaSyDoliAneRffQDyA7Ul9cDk3tLe7vaU4yP8' }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [],
        disallowedRoutes: []
      }
    }),
    PipesModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
