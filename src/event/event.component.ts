import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
import { Event, EventServiceService } from '../app/shared/services/evenement/event-service.service';

@Component({
  selector: 'app-event',
  standalone: false,
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent implements OnInit {
  //pour affichier list event compo html
  events: Event[] = [];
  //si creation nouveau obj model (sans id)
  newEvent: Partial<Event> = {
    title: '',
    date: '',
    lieu: '',
    description: '',
  };

  constructor(private eventService: EventServiceService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe((events) => {
      this.events = events;
    });
  }

  create() {
    const payload = {
      title: this.newEvent.title || "",
      date: this.newEvent.date || "",
      lieu: this.newEvent.lieu || "",
      description: this.newEvent.description || "",
    };

    this.eventService.createEvent(payload).subscribe((created) => {
      this.events.push(created);
      this.newEvent = { title: '', date: '', lieu: '', description: '' };
    });
  }
}
