import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type Niveau = 'Débutant' | 'Intermédiaire' | 'Avancé';
export interface Event {
  id: string;
  categorie: string;
  nombreMaxParticipants: number;
  adress: string;
  date: string;
  niveau: Niveau;
  dateCreation: string;
  idUtilisateur: string;
}

@Injectable({
  providedIn: 'root'
})


export class EventServiceService {
  private readonly baseUrl = 'http://localhost:3000/events';
  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<Event[]>{
    return this.http.get<Event[]>(this.baseUrl);
  }

  getById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/${id}`);
  }

  createEvent(event: Omit<Event, 'id' | 'dateCreation'>): Observable<Event> {
    const body = {...event, dateCreation: new Date().toISOString()};
    return this.http.post<Event>(this.baseUrl, event);
  }

   update(id: string, patch: Partial<Event>): Observable<Event> {
    return this.http.patch<Event>(`${this.baseUrl}/${id}`, patch);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
