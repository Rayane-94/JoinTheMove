import { Component, OnInit } from '@angular/core';
import {
  HistoriqueService,
  SeanceHistorique,
} from '../shared/services/historique/historique.service';
import {
  CategorieService,
  Categorie,
} from '../shared/services/categories/categories.service';
import { AuthService } from '../shared/services/auth/auth.service';
import { Router } from '@angular/router';

interface Statistiques {
  seancesRealisees: number;
  tempsTotal: number;
  seancesCetteSemaine: number;
  serieActuelle: number;
}

interface JourCalendrier {
  jour: number;
  date: Date;
  aSeance: boolean;
  estAujourdhui: boolean;
  estDansLeMois: boolean;
}

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css',
  standalone: false,
})
export class HistoriqueComponent implements OnInit {
  seancesHistorique: SeanceHistorique[] = [];
  categories: Categorie[] = [];
  statistiques: Statistiques = {
    seancesRealisees: 0,
    tempsTotal: 0,
    seancesCetteSemaine: 0,
    serieActuelle: 0,
  };
  calendrier: JourCalendrier[][] = [];
  moisActuel = new Date();
  utilisateurActuel: any = null;
  filtreCategorie = '';
  rechercheTexte = '';
  isLoading = true;

  constructor(
    private historiqueService: HistoriqueService,
    private categorieService: CategorieService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      this.authService.getCurrentUserAsync().subscribe({
        next: async (utilisateur) => {
          this.utilisateurActuel = utilisateur;

          if (this.utilisateurActuel) {
            await Promise.all([
              this.chargerHistorique(),
              this.chargerCategories(),
            ]);
            this.calculerStatistiques();
            this.genererCalendrier();
          } else {
            this.router.navigate(['/login']);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error(
            "❌ Erreur lors de la récupération de l'utilisateur:",
            error
          );
          this.isLoading = false;
        },
      });
    } catch (error) {
      console.error("❌ Erreur lors du chargement de l'historique:", error);
      this.isLoading = false;
    }
  }

  private async chargerHistorique(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.historiqueService.recupererHistorique().subscribe({
        next: (historique) => {
          if (!this.utilisateurActuel?.id) {
            console.warn('Aucun utilisateur connecté');
            this.seancesHistorique = [];
            resolve();
            return;
          }

          this.seancesHistorique = historique
            .filter((seance) => {
              const match =
                String(seance.idUtilisateur) ===
                String(this.utilisateurActuel.id);

              return match;
            })
            .map((seance) => ({
              ...seance,
              dateCreation: new Date(seance.dateCreation),
              dateRealisee: new Date(seance.dateRealisee),
            }))
            .sort(
              (a, b) =>
                new Date(b.dateRealisee).getTime() -
                new Date(a.dateRealisee).getTime()
            );
          resolve();
        },
        error: (error) => {
          console.error(
            "❌ Erreur lors de la récupération de l'historique:",
            error
          );
          reject(error);
        },
      });
    });
  }

  private async chargerCategories(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.categorieService.recupererCategories().subscribe({
        next: (categories: Categorie[]) => {
          this.categories = categories;
          resolve();
        },
        error: (error: any) => {
          console.error('Erreur lors du chargement des catégories:', error);
          reject(error);
        },
      });
    });
  }

  private calculerStatistiques(): void {
    const maintenant = new Date();
    const debutSemaine = new Date(maintenant);
    debutSemaine.setDate(maintenant.getDate() - maintenant.getDay() + 1); // Lundi de cette semaine
    debutSemaine.setHours(0, 0, 0, 0);

    this.statistiques.seancesRealisees = this.seancesHistorique.length;

    const tempsEnMinutes = this.calculerTempsTotal();
    this.statistiques.tempsTotal = Math.round((tempsEnMinutes / 60) * 10) / 10;

    const seancesSemaine = this.seancesHistorique.filter((seance) => {
      const dateSeance = new Date(seance.dateRealisee);
      const match = dateSeance >= debutSemaine;
      return match;
    });
    this.statistiques.seancesCetteSemaine = seancesSemaine.length;
    this.calculerSerieActuelle();
  }

  private calculerTempsTotal(): number {
    return this.seancesHistorique.reduce(
      (total, seance) => total + (seance.tempsRealise || 0),
      0
    );
  }

  private calculerSerieActuelle(): void {
    if (this.seancesHistorique.length === 0) {
      this.statistiques.serieActuelle = 0;
      return;
    }

    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);

    let serie = 0;
    let dateVerification = new Date(aujourdhui);

    const seancesParJour = new Map<string, boolean>();
    this.seancesHistorique.forEach((seance) => {
      const dateStr = new Date(seance.dateRealisee).toDateString();
      seancesParJour.set(dateStr, true);
    });

    while (seancesParJour.has(dateVerification.toDateString())) {
      serie++;
      dateVerification.setDate(dateVerification.getDate() - 1);
    }

    this.statistiques.serieActuelle = serie;
  }

  private genererCalendrier(): void {
    const annee = this.moisActuel.getFullYear();
    const mois = this.moisActuel.getMonth();
    const premierJour = new Date(annee, mois, 1);
    const dernierJour = new Date(annee, mois + 1, 0);
    const premierLundi = new Date(premierJour);
    premierLundi.setDate(
      premierJour.getDate() - ((premierJour.getDay() + 6) % 7)
    );

    this.calendrier = [];
    const dateActuelle = new Date(premierLundi);

    const seancesParJour = new Map<string, boolean>();
    this.seancesHistorique.forEach((seance) => {
      const dateStr = new Date(seance.dateRealisee).toDateString();
      seancesParJour.set(dateStr, true);
    });

    const aujourdhui = new Date();

    for (let semaine = 0; semaine < 6; semaine++) {
      const semaineJours: JourCalendrier[] = [];

      for (let jour = 0; jour < 7; jour++) {
        const date = new Date(dateActuelle);

        semaineJours.push({
          jour: date.getDate(),
          date: new Date(date),
          aSeance: seancesParJour.has(date.toDateString()),
          estAujourdhui: date.toDateString() === aujourdhui.toDateString(),
          estDansLeMois: date.getMonth() === mois,
        });

        dateActuelle.setDate(dateActuelle.getDate() + 1);
      }

      this.calendrier.push(semaineJours);
    }
  }

  obtenirLabelCategorie(idCategorie: string | null): string {
    if (!idCategorie) return 'Sans catégorie';
    const categorie = this.categories.find((c) => c.id === idCategorie);
    return categorie ? categorie.label : 'Catégorie inconnue';
  }

  get seancesFiltrees(): SeanceHistorique[] {
    return this.seancesHistorique.filter((seance) => {
      const matchCategorie =
        !this.filtreCategorie || seance.idCategorie === this.filtreCategorie;
      const matchTexte =
        !this.rechercheTexte ||
        seance.label
          .toLowerCase()
          .includes(this.rechercheTexte.toLowerCase()) ||
        seance.description
          .toLowerCase()
          .includes(this.rechercheTexte.toLowerCase());

      return matchCategorie && matchTexte;
    });
  }

  onFiltreCategorie(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filtreCategorie = target.value;
  }

  onRechercheTexte(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.rechercheTexte = target.value;
  }

  formaterDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  obtenirNomMois(): string {
    return this.moisActuel.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });
  }

  moisPrecedent(): void {
    this.moisActuel = new Date(
      this.moisActuel.getFullYear(),
      this.moisActuel.getMonth() - 1,
      1
    );
    this.genererCalendrier();
  }

  moisSuivant(): void {
    this.moisActuel = new Date(
      this.moisActuel.getFullYear(),
      this.moisActuel.getMonth() + 1,
      1
    );
    this.genererCalendrier();
  }

  getClasseJour(jour: JourCalendrier): string {
    let classes =
      'aspect-square rounded-lg flex items-center justify-center text-sm';

    if (!jour.estDansLeMois) {
      return classes + ' text-gray-300';
    }

    if (jour.estAujourdhui) {
      return classes + ' bg-blue-600 text-white font-medium';
    }

    if (jour.aSeance) {
      return classes + ' bg-green-200 text-green-800 font-medium';
    }

    return classes + ' bg-gray-100 text-gray-700 font-medium hover:bg-gray-200';
  }

  getTitreJour(jour: JourCalendrier): string {
    if (jour.estAujourdhui) {
      return "Aujourd'hui";
    }

    if (jour.aSeance) {
      return 'Séance réalisée';
    }

    return '';
  }

  obtenirClasseDifficulte(difficulte: string): string {
    switch (difficulte) {
      case 'facile':
        return 'bg-green-100 text-green-500  border border-green-400';
      case 'moyenne':
        return 'bg-yellow-100 text-yellow-500  border border-yellow-400';
      case 'difficile':
        return 'bg-red-100 text-red-500 border border-red-400';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  }

  obtenirIconeDifficulte(difficulte: string): string {
    switch (difficulte) {
      case 'facile':
        return 'sentiment_satisfied';
      case 'moyenne':
        return 'sentiment_neutral';
      case 'difficile':
        return 'sentiment_very_dissatisfied';
      default:
        return 'help_outline';
    }
  }

  formaterTemps(minutes: number): string {
    const heures = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (heures > 0) {
      return `${heures}h${mins > 0 ? ` ${mins}min` : ''}`;
    }
    return `${mins}min`;
  }

  capitaliserPremierLettre(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
