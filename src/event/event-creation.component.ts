import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventServiceService, Event } from '../app/shared/services/evenement/event-service.service';
import { Categorie } from '../app/shared/services/categories/categories.service';
import { Niveau } from '../app/shared/services/evenement/event-service.service';
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
    nombreMaxParticipants: 10,
    adress: '',
    date: '',
    niveau: 'Débutant',
    dateCreation: '',
    idUtilisateur: ''
  };

  constructor(
    private eventService: EventServiceService, 
    private router: Router, 
    private http: HttpClient) {
        this.http.get<Categorie[]>('http://localhost:3000/categories').subscribe(categorieRef => {
          this.categories = categorieRef.filter(c => c.estVisible);
        });
    }

  create() {
    if (!this.newEvent.categorie || !this.newEvent.adress || !this.newEvent.date) return;

     const payload: Omit<Event, 'id' | 'dateCreation'> = {
      categorie: this.newEvent.categorie!,
      nombreMaxParticipants: this.newEvent.nombreMaxParticipants ?? 10,
      adress: this.newEvent.adress!,
      date: new Date(this.newEvent.date!).toISOString(),
      niveau: this.newEvent.niveau ?? 'Débutant',
      idUtilisateur: '1'
    };

    this.eventService.createEvent(payload).subscribe((created) => {
      // après création, retourner à la liste
      this.router.navigate(['/evenements']);
    });
  }
}
