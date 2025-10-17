import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './login/login/login.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { DashboardComponent as SeancesDashboardComponent } from './seances/dashboard/dashboard.component';

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
