import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './seances/dashboard/dashboard.component';
import { FormSeanceComponent } from './seances/form-seance/form-seance.component';

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
    path: 'seances/nouvelle',
    component: FormSeanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
