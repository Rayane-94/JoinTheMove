import { Event, EventServiceService } from '../app/shared/services/evenement/event-service.service';
import { Component, OnInit } from '@angular/core';
import { Categorie } from '../app/shared/services/categories/categories.service';
import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-event',
  standalone: false,
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent implements OnInit {
  //pour affichier list event compo html
  events: Event[] = [];
  categoriesById = new Map<string, Categorie>();

  constructor(private eventService: EventServiceService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEvents();
  } 

  loadEvents() {
    this.eventService.getAllEvents().subscribe(eventRef => this.events = eventRef);
    this.http.get<Categorie[]>('http://localhost:3000/categories').subscribe(cats => {
      this.categoriesById = new Map(cats.map(c => [c.id, c]));
    });
  }

  catLabel(id: string): string {
    return this.categoriesById.get(id)?.label ?? '—';
  }

}
