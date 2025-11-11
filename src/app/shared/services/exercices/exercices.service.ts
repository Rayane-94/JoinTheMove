import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, switchMap, of } from 'rxjs';

export interface Exercice {
  id: string;
  label: string;
  dateCreation: Date;
  description: string;
  idUtilisateur: string | null;
  nombreSerie: number;
  nombreRepetition: number;
  tempsRepos: number;
}

export interface SeanceExercice {
  id: string;
  seanceId: string;
  exerciceId: string;
  ordre: number;
}

export interface ExerciceAvecOrdre extends Exercice {
  ordre?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExercicesService {
  constructor(private http: HttpClient) {}

  recupererExercices(): Observable<Exercice[]> {
    return this.http.get<Exercice[]>('http://localhost:3000/exercices');
  }

  recupererExercicesParUtilisateur(
    idUtilisateur: string
  ): Observable<Exercice[]> {
    return this.http.get<Exercice[]>(
      `http://localhost:3000/exercices?idUtilisateur=${idUtilisateur}`
    );
  }

  recupererUnExerciceParId(id: string): Observable<Exercice> {
    return this.http.get<Exercice>(`http://localhost:3000/exercices/${id}`);
  }

  ajouterExercice(exercice: Exercice): Observable<Exercice> {
    const exerciceFormatted = {
      ...exercice,
      idUtilisateur:
        typeof exercice.idUtilisateur === 'string'
          ? exercice.idUtilisateur
          : String(exercice.idUtilisateur),
    };
    console.log('Exercice formaté avant envoi:', exerciceFormatted);
    return this.http.post<Exercice>(
      'http://localhost:3000/exercices',
      exerciceFormatted
    );
  }

  modifierExercice(exercice: Exercice): Observable<Exercice> {
    const exerciceFormatted = {
      ...exercice,
      idUtilisateur:
        typeof exercice.idUtilisateur === 'string'
          ? exercice.idUtilisateur
          : String(exercice.idUtilisateur),
    };
    return this.http.put<Exercice>(
      `http://localhost:3000/exercices/${exercice.id}`,
      exerciceFormatted
    );
  }

  supprimerExercice(id: string): Observable<boolean> {
    return this.http
      .delete(`http://localhost:3000/exercices/${id}`)
      .pipe(map(() => true));
  }

  attacherExercicesASeance(
    seanceId: string,
    exerciceIds: string[]
  ): Observable<SeanceExercice[]> {
    const seanceExercices = exerciceIds.map((exerciceId, index) => ({
      id: `${seanceId}-${exerciceId}`,
      seanceId,
      exerciceId,
      ordre: index + 1,
    }));

    return this.http.post<SeanceExercice[]>(
      'http://localhost:3000/seanceExercices',
      seanceExercices
    );
  }

  detacherExerciceDeSeance(
    seanceId: string,
    exerciceId: string
  ): Observable<boolean> {
    return this.http
      .delete(`http://localhost:3000/seanceExercices/${seanceId}-${exerciceId}`)
      .pipe(map(() => true));
  }

  recupererExercicesDeSeance(seanceId: string): Observable<Exercice[]> {
    return this.http
      .get<SeanceExercice[]>(
        `http://localhost:3000/seanceExercices?seanceId=${seanceId}`
      )
      .pipe(
        switchMap((relations) => {
          if (relations.length === 0) {
            return of([]);
          }

          const exerciceIds = relations
            .sort((a, b) => a.ordre - b.ordre)
            .map((relation) => relation.exerciceId);

          const requests = exerciceIds.map((id) =>
            this.http.get<Exercice>(`http://localhost:3000/exercices/${id}`)
          );

          return forkJoin(requests);
        })
      );
  }

  modifierOrdreExercicesSeance(
    seanceId: string,
    exerciceIds: string[]
  ): Observable<SeanceExercice[]> {
    return this.http
      .get<SeanceExercice[]>(
        `http://localhost:3000/seanceExercices?seanceId=${seanceId}`
      )
      .pipe(
        switchMap((relations) => {
          const deleteRequests = relations.map((relation) =>
            this.http.delete(
              `http://localhost:3000/seanceExercices/${relation.id}`
            )
          );

          if (deleteRequests.length === 0) {
            return of([]);
          }

          return forkJoin(deleteRequests);
        }),
        switchMap(() => {
          return this.attacherExercicesASeance(seanceId, exerciceIds);
        })
      );
  }
}
