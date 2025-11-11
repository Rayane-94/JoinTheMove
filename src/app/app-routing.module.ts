import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { SeancesDashboardComponent } from './seances/dashboard/dashboardSeances.component';
import { LoginComponent } from './login/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { guardGuard } from './shared/guards/guard.guard';
import { FormSeanceComponent } from './seances/form-seance/form-seance.component';
import { ModifierSeanceComponent } from './seances/modifier-seance/modifier-seance.component';
import { HistoriqueComponent } from './historique/historique.component';
import { ProfilComponent } from './profil/profil.component';
import { DashboardExercicesComponent } from './exercices/dashboard/dashboard-exercices.component';
import { FormExerciceComponent } from './exercices/form-exercice/form-exercice.component';
import { EventComponent } from '../event/event.component';
import { EventCreationComponent } from '../event/event-creation.component'

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
    component: RegisterComponent,
  },
  {
    path: 'seances/nouvelle',
    component: FormSeanceComponent,
    canActivate: [guardGuard],
  },
  {
    path: 'seances/modifier/:id',
    component: ModifierSeanceComponent,
    canActivate: [guardGuard],
  },
  {
    path: 'historique',
    component: HistoriqueComponent,
    canActivate: [guardGuard],
  },
  {
    path: 'profil',
    component: ProfilComponent,
    canActivate: [guardGuard],
  },
  {
    path: 'exercices',
    component: DashboardExercicesComponent,
    canActivate: [guardGuard],
  },
  {
    path: 'exercices/nouveau',
    component: FormExerciceComponent,
    canActivate: [guardGuard],
  },
  {
    path: 'exercices/modifier/:id',
    component: FormExerciceComponent,
    canActivate: [guardGuard],
  },  
 {
    path: 'evenements',
    component: EventComponent,
    canActivate: [guardGuard],
  },

 {
    path: 'evenements/creer',
    component: EventCreationComponent,
    canActivate: [guardGuard],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
