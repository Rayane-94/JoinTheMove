import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Seance {
  id: number;
  label: string;
  dateCreation: Date;
  lieu: string;
  description: string;
  idUtilisateur: number | null;
  exercice: any | null;
  categorie: any | null;
}

@Injectable({
  providedIn: 'root',
})
export class SeancesService {
  constructor(private http: HttpClient) {}

  recupererSeances(): Observable<Seance[]> {
    return this.http.get<Seance[]>('http://localhost:3000/seances');
  }

  recupererUneSeance(id: number): Observable<Seance> {
    return this.http.get<Seance>(`http://localhost:3000/seances/${id}`);
  }
}
