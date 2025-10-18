import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import{ DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { SeancesDashboardComponent } from './seances/dashboard/dashboardSeances.component';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
  },
  {
    path: 'seances',
    component: SeancesDashboardComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
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
