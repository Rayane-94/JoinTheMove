import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { CategorieService, Categorie } from '../categories/categories.service';
import { Exercice } from '../exercices/exercices.service';

export interface Seance {
  id: string;
  label: string;
  dateCreation: Date;
  description: string;
  idUtilisateur: string | null;
  exercice: string[] | null;
  idCategorie: string | null;
}

export interface SeanceComplete extends Seance {
  exercicesDetails?: Exercice[];
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
    return this.http.get<Seance[]>(
      `http://localhost:3000/seances?idUtilisateur=${idUtilisateur}`
    );
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

  recupererUneSeanceParId(id: string): Observable<Seance> {
    return this.http.get<Seance>(`http://localhost:3000/seances/${id}`);
  }

  recupererSeanceCompleteParId(id: string): Observable<SeanceComplete> {
    return this.recupererUneSeanceParId(id).pipe(
      switchMap((seance) => {
        if (seance.exercice && seance.exercice.length > 0) {
          const exerciceRequests = seance.exercice.map((exerciceId) =>
            this.http.get<Exercice>(
              `http://localhost:3000/exercices/${exerciceId}`
            )
          );

          return forkJoin(exerciceRequests).pipe(
            map((exercicesDetails) => ({
              ...seance,
              exercicesDetails,
            }))
          );
        } else {
          return [{ ...seance, exercicesDetails: [] }];
        }
      })
    );
  }

  ajouterSeance(seance: Seance): Observable<Seance> {
    const seanceFormatted = {
      ...seance,
      idUtilisateur:
        typeof seance.idUtilisateur === 'string'
          ? seance.idUtilisateur
          : String(seance.idUtilisateur),
      idCategorie:
        typeof seance.idCategorie === 'string'
          ? seance.idCategorie
          : String(seance.idCategorie),
    };
    return this.http.post<Seance>(
      'http://localhost:3000/seances',
      seanceFormatted
    );
  }

  modifierSeance(seance: Seance): Observable<Seance> {
    const seanceFormatted = {
      ...seance,
      idUtilisateur:
        typeof seance.idUtilisateur === 'string'
          ? seance.idUtilisateur
          : String(seance.idUtilisateur),
      idCategorie:
        typeof seance.idCategorie === 'string'
          ? seance.idCategorie
          : String(seance.idCategorie),
    };
    return this.http.put<Seance>(
      `http://localhost:3000/seances/${seance.id}`,
      seanceFormatted
    );
  }

  supprimerSeance(id: string): Observable<boolean> {
    return this.http
      .delete(`http://localhost:3000/seances/${id}`)
      .pipe(map(() => true));
  }

  ajouterExercicesASeance(
    seanceId: string,
    exerciceIds: string[]
  ): Observable<any> {
    const seanceExercices = exerciceIds.map((exerciceId, index) => ({
      id: `${seanceId}-${exerciceId}`,
      seanceId,
      exerciceId,
      ordre: index + 1,
    }));

    return this.http.post(
      'http://localhost:3000/seanceExercices',
      seanceExercices
    );
  }

  supprimerExerciceDeSeance(
    seanceId: string,
    exerciceId: string
  ): Observable<boolean> {
    return this.http
      .delete(`http://localhost:3000/seanceExercices/${seanceId}-${exerciceId}`)
      .pipe(map(() => true));
  }
}
