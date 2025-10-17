import { Routes } from '@angular/router';
import { DashboardComponent } from './seances/dashboard/dashboard.component';
import { EventComponent } from '../event/event.component';

export const routes: Routes = [
    {
        path: 'seances',
        component: DashboardComponent,
    },
    {
        path: 'evenements',
        component: EventComponent,
        children: [
            {
                path: 'creer',
                component: EventComponent,
            },
        ],
    },
];
