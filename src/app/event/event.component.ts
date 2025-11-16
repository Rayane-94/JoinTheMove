import { Event, EventServiceService, Niveau } from '../shared/services/evenement/event-service.service';
import { Component, OnInit } from '@angular/core';
import { Categorie } from '../shared/services/categories/categories.service';
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
  loading = false;
  errorMsg = '';

  categories: Categorie[] = [];
  categoriesById = new Map<string, Categorie>();

  niveaux: Niveau[] = ['Débutant', 'Intermédiaire', 'Avancé'];

  createdEventSummary?: Event;
  isEditModalOpen = false;
  editEventOriginal?: Event | null;

  editEventForm: {
    id?: string;
    categorie?: string;
    nombreMaxParticipants?: string;
    adress?: string;
    dateLocal?: string;
    niveau?: string;
    idUtilisateur?: string;
  } = {};

  constructor(private eventService: EventServiceService, private http: HttpClient) {}

  ngOnInit(): void {
    //affichage si cretion d'event
    const state = history.state as { createdEvent?: Event };
    if (state?.createdEvent) this.createdEventSummary = state.createdEvent;

    this.loadEvents();
  } 

  loadEvents() {
    this.loading = true;
    this.errorMsg = '';
    this.eventService.getAllEvents().subscribe(eventRef => this.events = eventRef);
    this.http.get<Categorie[]>('http://localhost:3000/categories').subscribe(
      {
        next: (categorieRef) => {
          this.categoriesById = new Map(categorieRef.map(c => [c.id, c]));
          this.eventService.getAllEvents().subscribe({
            next: (evts) => { this.events = evts; this.loading = false; },
            error: (err) => { this.loading = false; this.errorMsg = err?.message || 'Erreur chargement'; }
        });
        },
        error: (err) => { this.loading = false; this.errorMsg = err?.message || 'Erreur catégories'; }
      }
    );
  }

  catLabel(id: string): string {
    return this.categoriesById.get(id)?.label ?? '—';
  }

  deleteEvent(ev: Event) {
    const ok = confirm(`Supprimer l'événement à "${ev.adress}" ?`);
    if (!ok) return;

      this.eventService.deleteEvent(ev.id).subscribe({
      next: () => {
        this.events = this.events.filter(e => e.id !== ev.id);

        if (this.createdEventSummary && this.createdEventSummary.id === ev.id) {
          this.createdEventSummary = undefined;
        }
      },
      error: (err) => {
        this.errorMsg = err?.message || 'Erreur lors de la suppression.';
      }
    });
  }


  openEditModal(ev: Event) {
    this.editEventOriginal = ev;

    this.editEventForm = {
      id: ev.id,
      categorie: ev.categorie,
      nombreMaxParticipants: ev.nombreMaxParticipants,
      adress: ev.adress,
      dateLocal: this.isoToLocalInput(ev.date),
      niveau: ev.niveau,
      idUtilisateur: ev.idUtilisateur,
    };

    this.isEditModalOpen = true;
  }

  
  closeEditModal() {
    this.isEditModalOpen = false;
    this.editEventOriginal = null;
    this.editEventForm = {};
  }

  //pour interpréter date dans l'input de la modale
  private isoToLocalInput(iso: string): string {
    if (!iso) return '';
    return iso.slice(0, 16);
  }

   saveEdit() {
    if (!this.editEventOriginal || !this.editEventForm.id) return;

    const niveau: Niveau = (this.editEventForm.niveau ?? this.editEventOriginal.niveau) as Niveau;

    const patch: Partial<Event> = {
      categorie: this.editEventForm.categorie ?? this.editEventOriginal.categorie,
      nombreMaxParticipants: this.editEventForm.nombreMaxParticipants ?? this.editEventOriginal.nombreMaxParticipants,
      adress: this.editEventForm.adress ?? this.editEventOriginal.adress,
      niveau,
      idUtilisateur: this.editEventForm.idUtilisateur ?? this.editEventOriginal.idUtilisateur,
    };

    if (this.editEventForm.dateLocal) {
      patch.date = new Date(this.editEventForm.dateLocal).toISOString();
    }

    this.eventService.updateEvent(this.editEventForm.id, patch).subscribe({
      next: (updated) => {
        // on remplace l'event dans le tableau
        this.events = this.events.map(e => e.id === updated.id ? updated : e);

        // si resum concernait cet event on le met à jour aussi
        if (this.createdEventSummary && this.createdEventSummary.id === updated.id) {
          this.createdEventSummary = updated;
        }

        this.closeEditModal();
      },
      error: (err) => {
        this.errorMsg = err?.message || 'Erreur lors de la mise à jour.';
      }
    }); 
  }
}
