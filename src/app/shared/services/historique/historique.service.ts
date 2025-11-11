import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { CategorieService, Categorie } from '../categories/categories.service';
import { SeanceAvecCategorie } from '../seances/seances.service';

export interface Seance {
  id: string;
  label: string;
  dateCreation: Date;
  description: string;
  idUtilisateur: string | null;
  exercice: any | null;
  idCategorie: string | null;
}

export interface SeanceHistorique extends Seance {
  dateRealisee: Date;
  tempsRealise: number;
  difficulte: 'facile' | 'moyenne' | 'difficile';
  categorieLabel?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HistoriqueService {
  constructor(
    private http: HttpClient,
    private categorieService: CategorieService
  ) {}

  recupererHistorique(): Observable<SeanceHistorique[]> {
    return this.http.get<SeanceHistorique[]>(
      'http://localhost:3000/historique'
    );
  }

  ajouterSeanceAHistorique(
    seance: Seance,
    tempsRealise: number,
    difficulte: 'facile' | 'moyenne' | 'difficile'
  ): Observable<SeanceHistorique> {
    const historiqueId = seance.id + '-' + Date.now();

    if (seance.idCategorie) {
      return this.categorieService
        .recupererUneCategorieParId(seance.idCategorie)
        .pipe(
          switchMap((categorie) => {
            const seanceHistorique: SeanceHistorique = {
              ...seance,
              id: historiqueId,
              dateRealisee: new Date(),
              tempsRealise,
              difficulte,
              categorieLabel: categorie?.label || 'Sans catégorie',
            };

            return this.http.post<SeanceHistorique>(
              'http://localhost:3000/historique',
              seanceHistorique
            );
          })
        );
    } else {
      const seanceHistorique: SeanceHistorique = {
        ...seance,
        id: historiqueId,
        dateRealisee: new Date(),
        tempsRealise,
        difficulte,
        categorieLabel: 'Sans catégorie',
      };

      return this.http.post<SeanceHistorique>(
        'http://localhost:3000/historique',
        seanceHistorique
      );
    }
  }
}
