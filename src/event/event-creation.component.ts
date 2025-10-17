import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventServiceService, Event } from '../app/shared/services/evenement/event-service.service';

@Component({
    standalone: false,
    selector: 'app-event-creation',
    templateUrl: './event-creation.component.html',
    styleUrls: ['./event.component.css']
})
export class EventCreationComponent {
  newEvent: Partial<Event> = {
    title: '',
    date: '',
    lieu: '',
    description: ''
  };

  constructor(private eventService: EventServiceService, private router: Router) {}

  create() {
    const payload = {
      title: this.newEvent.title || '',
      date: this.newEvent.date || '',
      lieu: this.newEvent.lieu || '',
      description: this.newEvent.description || ''
    };

    this.eventService.createEvent(payload).subscribe((created) => {
      // après création, retourner à la liste
      this.router.navigate(['/evenements']);
    });
  }
}
