import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { Ng2PaginationModule } from 'ng2-pagination';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageMaintenanceComponent } from './manage/manage-maintenance/manage-maintenance.component';
import { ManageStatusItemsComponent } from './manage/manage-status-items/manage-status-items.component';
import { ManageComponent } from './manage/manage.component';

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
    ReactiveFormsModule,
    HttpModule,
    MaterialModule,
    Ng2PaginationModule,
    RouterModule.forRoot(appRoutes, {useHash: true})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
