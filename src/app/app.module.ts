import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './login/login/login.component';
import { SeancesDashboardComponent } from './seances/dashboard/dashboardSeances.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { FormSeanceComponent } from './seances/form-seance/form-seance.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { ModifierSeanceComponent } from './seances/modifier-seance/modifier-seance.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { HistoriqueComponent } from './historique/historique.component';
import { PopupSeanceRealiseeComponent } from './shared/components/popup-seance-realisee/popup-seance-realisee.component';
import { ProfilComponent } from './profil/profil.component';
import { DashboardExercicesComponent } from './exercices/dashboard/dashboard-exercices.component';
import { FormExerciceComponent } from './exercices/form-exercice/form-exercice.component';
import { PopupDetailsSeanceComponent } from './shared/components/popup-details-seance/popup-details-seance.component';
import { FormsModule } from '@angular/forms';
import { EventComponent } from './event/event.component';
import { EventCreationComponent } from './event/event-creation.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    SeancesDashboardComponent,
    FormSeanceComponent,
    HeaderComponent,
    ModifierSeanceComponent,
    HistoriqueComponent,
    PopupSeanceRealiseeComponent,
    ProfilComponent,
    DashboardExercicesComponent,
    FormExerciceComponent,
    PopupDetailsSeanceComponent,
    EventComponent,
    EventCreationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    FormsModule,
    // Angular Material Modules
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    ToastComponent,
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}