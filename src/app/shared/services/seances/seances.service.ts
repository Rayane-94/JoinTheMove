import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { CategorieService, Categorie } from '../categories/categories.service';

export interface Seance {
  id: number;
  label: string;
  dateCreation: Date;
  description: string;
  idUtilisateur: string | null;
  exercice: any | null;
  idCategorie: number | null;
}

export interface SeanceAvecCategorie extends Seance {
  categorieLabel?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeancesService {
  constructor(
    private http: HttpClient,
    private categorieService: CategorieService
  ) {}

  recupererSeances(): Observable<Seance[]> {
    return this.http.get<Seance[]>('http://localhost:3000/seances');
  }

  recupererSeancesParUtilisateur(idUtilisateur: string): Observable<Seance[]> {
    return this.http.get<Seance[]>(`http://localhost:3000/seances?idUtilisateur=${idUtilisateur}`);
  }

  recupererSeancesAvecCategories(): Observable<SeanceAvecCategorie[]> {
    return forkJoin({
      seances: this.recupererSeances(),
      categories: this.categorieService.recupererCategories(),
    }).pipe(
      map(({ seances, categories }) => {
        return seances.map((seance) => ({
          ...seance,
          categorieLabel: seance.idCategorie
            ? categories.find((cat) => cat.id === seance.idCategorie)?.label
            : undefined,
        }));
      })
    );
  }

  recupererSeancesAvecCategoriesParUtilisateur(
    id: string
  ): Observable<SeanceAvecCategorie[]> {
    return forkJoin({
      seances: this.recupererSeancesParUtilisateur(id),
      categories: this.categorieService.recupererCategories(),
    }).pipe(
      map(({ seances, categories }) => {
        return seances.map((seance) => ({
          ...seance,
          categorieLabel: seance.idCategorie
            ? categories.find((cat) => cat.id === seance.idCategorie)?.label
            : undefined,
        }));
      })
    );
  }

  recupererUneSeanceParId(id: number): Observable<Seance> {
    return this.http.get<Seance>(`http://localhost:3000/seances/${id}`);
  }

  ajouterSeance(seance: Seance): Observable<Seance> {
    return this.http.post<Seance>('http://localhost:3000/seances', seance);
  }
}
