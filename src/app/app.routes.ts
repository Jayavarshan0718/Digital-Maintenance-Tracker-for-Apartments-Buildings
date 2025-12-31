import { Routes } from '@angular/router';
import { MaintenanceRequestComponent } from './resident/maintenance-request/maintenance-request';
import { RequestHistoryComponent } from './resident/request-history/request-history';
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard';
import { TechnicianDashboardComponent } from './technician/dashboard/technician-dashboard';
import { SigninComponent } from './auth/signin/signin';
import { SignupComponent } from './auth/signup/signup';

export const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'new-request', component: MaintenanceRequestComponent },
  { path: 'history', component: RequestHistoryComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'technician', component: TechnicianDashboardComponent }
];
