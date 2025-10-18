import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import{ DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { SeancesDashboardComponent } from './seances/dashboard/dashboardSeances.component';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { guardGuard } from './auth/guard.guard';

const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
  },
  {
    path: 'seances',
    component: SeancesDashboardComponent,
    canActivate: [guardGuard], 
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [guardGuard], 
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent ,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
