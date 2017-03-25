import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ManageComponent } from './manage/manage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageBuildsComponent } from './manage/manage-builds/manage-builds.component';
import { ManageDeploymentsComponent } from './manage/manage-deployments/manage-deployments.component';
import { ManageMaintenanceComponent } from './manage/manage-maintenance/manage-maintenance.component';

const appRoutes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'manage', component: ManageComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    ManageComponent,
    DashboardComponent,
    ManageBuildsComponent,
    ManageDeploymentsComponent,
    ManageMaintenanceComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule,
    RouterModule.forRoot(appRoutes, { useHash: true })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
