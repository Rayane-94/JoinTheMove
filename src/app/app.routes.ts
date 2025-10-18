import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './login/login/login.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { SeancesDashboardComponent } from './seances/dashboard/dashboardSeances.component';

export const routes: Routes = [
{ 
    path: '', 
    redirectTo: '/register', 
    pathMatch: 'full' 
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  { 
    path: 'login', 
    component: LoginComponent
    
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent
  },
  {
    path: 'seances',
    component: SeancesDashboardComponent,
  },
];
