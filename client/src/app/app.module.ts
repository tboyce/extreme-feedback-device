import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {
  MdButtonModule, MdChipsModule, MdIconModule, MdListModule, MdSlideToggleModule,
  MdTabsModule, MdToolbarModule, MdTooltipModule
} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import {MomentModule} from 'angular2-moment';

import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ManageMaintenanceComponent} from './manage/manage-maintenance/manage-maintenance.component';
import {ManageStatusItemsComponent} from './manage/manage-status-items/manage-status-items.component';
import {ManageComponent} from './manage/manage.component';

const appRoutes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'manage', component: ManageComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    ManageComponent,
    DashboardComponent,
    ManageMaintenanceComponent,
    ManageStatusItemsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpModule,
    NgxPaginationModule,
    MdButtonModule,
    MdChipsModule,
    MdIconModule,
    MdListModule,
    MdSlideToggleModule,
    MdTabsModule,
    MdToolbarModule,
    MdTooltipModule,
    MomentModule,
    RouterModule.forRoot(appRoutes, {useHash: true})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
