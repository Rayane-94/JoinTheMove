import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './seances/dashboard/dashboard.component';
import { EventComponent } from '../event/event.component';
import { EventCreationComponent } from '../event/event-creation.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'seances',
    component: DashboardComponent,
  },
  {
    path: 'evenements',
    component: EventComponent,
  },
  {
    path: 'evenements/creer',
    component: EventCreationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
