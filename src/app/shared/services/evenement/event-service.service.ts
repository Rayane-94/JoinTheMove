import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Event {
  id: number;
  title: string;
  date: string;
  lieu: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})


export class EventServiceService {

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<Event[]>{
    return this.http.get<Event[]>('http://localhost:3000/events');
  }

  createEvent(event: Omit<Event, 'id'>): Observable<Event> {
    return this.http.post<Event>('http://localhost:3000/events', event);
  }
}
