import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventServiceService, Event } from '../shared/services/evenement/event-service.service';
import { Categorie } from '../shared/services/categories/categories.service';
import { Niveau } from '../shared/services/evenement/event-service.service';
import { HttpClient } from '@angular/common/http';

@Component({
    standalone: false,
    selector: 'app-event-creation',
    templateUrl: './event-creation.component.html',
    styleUrls: ['./event.component.css']
})
export class EventCreationComponent {
  categories: Categorie[] = [];
  niveaux: Niveau[] = ['Débutant', 'Intermédiaire', 'Avancé'];
  
  newEvent: Partial<Event> = {
    categorie: '',
    nombreMaxParticipants: '',
    adress: '',
    date: '',
    niveau: 'Débutant',
    dateCreation: '',
    idUtilisateur: ''
  };

  loading = false;
  errorMsg = '';

  constructor(
    private eventService: EventServiceService, 
    private router: Router, 
    private http: HttpClient) {
        this.http.get<Categorie[]>('http://localhost:3000/categories').subscribe(categorieRef => {
          this.categories = categorieRef.filter(c => c.estVisible);
        });
    }

  create() {
    this.errorMsg = '';
    if (!this.newEvent.categorie || !this.newEvent.adress || !this.newEvent.date) return;

    this.loading = true;
    const payload: Omit<Event, 'id' | 'dateCreation'> = {
      categorie: this.newEvent.categorie!,
      nombreMaxParticipants: this.newEvent.nombreMaxParticipants ?? '',
      adress: this.newEvent.adress!,
      date: new Date(this.newEvent.date!).toISOString(),
      niveau: this.newEvent.niveau ?? 'Débutant',
      idUtilisateur: '1'
    };

    this.eventService.createEvent(payload).subscribe({
      next: (created) => {
        console.log("state event creation =>", created)
        this.loading = false;
        this.router.navigate(['/evenements'], { state: { createdEvent: created }});
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.message || 'Erreur lors de la création.';
      }
    });
  }
}
