import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './seances/dashboard/dashboard.component';
import { EventComponent } from '../event/event.component';
import { EventCreationComponent } from '../event/event-creation.component';

@NgModule({
  declarations: [AppComponent, DashboardComponent, EventComponent, EventCreationComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule, AppRoutingModule],
  //imports: [EventComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
