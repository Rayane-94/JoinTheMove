import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Seance {
  id: number;
  label: string;
  dateCreation: Date;
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

  recupererUneSeanceParId(id: number): Observable<Seance> {
    return this.http.get<Seance>(`http://localhost:3000/seances/${id}`);
  }

  ajouterSeance(seance: Seance): Observable<Seance> {
    return this.http.post<Seance>('http://localhost:3000/seances', seance);
  }
}
