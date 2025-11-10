import { Component, OnInit } from '@angular/core';
import {
  SeancesService,
  SeanceAvecCategorie,
} from '../../shared/services/seances/seances.service';
import { PageEvent } from '@angular/material/paginator';
import { formatDate, formatTemps } from '../../shared/utils/date';
import { AuthService, User } from '../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupSeanceRealiseeComponent } from '../../shared/components/popup-seance-realisee/popup-seance-realisee.component';
import { HistoriqueService } from '../../shared/services/historique/historique.service';

@Component({
  selector: 'app-seances-dashboard',
  templateUrl: './dashboardSeances.component.html',
  styleUrl: './dashboardSeances.component.css',
  standalone: false,
})
export class SeancesDashboardComponent implements OnInit {
  seances: SeanceAvecCategorie[] = [];
  seancesAffichees: SeanceAvecCategorie[] = [];
  isLoading = true;
  errorMessage = '';

  pageSize = 5;
  pageIndex = 0;
  totalSeances = 0;
  pageSizeOptions = [5, 10, 25];

  constructor(
    private seancesService: SeancesService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private dialog: MatDialog,
    private historiqueService: HistoriqueService
  ) {}

  ngOnInit() {
    this.verifierEtChargerSeances();
  }

  private verifierEtChargerSeances() {
    this.authService.getCurrentUserAsync().subscribe({
      next: (utilisateur) => {
        if (utilisateur) {
          this.chargerSeances(utilisateur);
        } else {
          this.gererUtilisateurNonConnecte();
        }
      },
      error: (error) => {
        console.error(
          'Erreur lors de la récupération des données utilisateur:',
          error
        );
        this.gererUtilisateurNonConnecte();
      },
    });
  }

  private gererUtilisateurNonConnecte() {
    this.errorMessage = 'Vous devez être connecté pour voir vos séances';
    this.isLoading = false;
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  chargerSeances(utilisateur: User) {
    this.isLoading = true;

    this.seancesService
      .recupererSeancesAvecCategoriesParUtilisateur(utilisateur.id)
      .subscribe({
        next: (seances) => {
          this.seances = seances;
          this.totalSeances = seances.length;
          this.updateSeancesAffichees();
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors du chargement des séances';
          this.isLoading = false;
          console.error('Erreur:', error);
        },
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateSeancesAffichees();
  }

  supprimerSeance(seance: SeanceAvecCategorie) {
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer la séance "${seance.label}" ?`
      )
    ) {
      this.seancesService.supprimerSeance(seance.id).subscribe({
        next: (success) => {
          if (success) {
            this.seances = this.seances.filter((s) => s.id !== seance.id);
            this.totalSeances = this.seances.length;
            this.updateSeancesAffichees();
            this.toastService.succes('Séance supprimée avec succès !');
            this.errorMessage = '';
          }
        },
        error: (error) => {
          this.toastService.erreur(
            'Erreur lors de la suppression de la séance'
          );
          console.error('Erreur:', error);
        },
      });
    }
  }

  private updateSeancesAffichees() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.seancesAffichees = this.seances.slice(startIndex, endIndex);
  }

  getTypeIcon(categorieLabel: string | undefined): string {
    if (!categorieLabel) return 'sports';

    const categorie = categorieLabel.toLowerCase();
    if (categorie.includes('musculation')) return 'fitness_center';
    if (categorie.includes('course')) return 'directions_run';
    if (categorie.includes('cardio')) return 'favorite';
    if (categorie.includes('yoga')) return 'self_improvement';
    if (categorie.includes('natation')) return 'pool';
    return 'sports';
  }

  getTypeClass(categorieLabel: string | undefined): string {
    if (!categorieLabel) return 'type-default';

    const categorie = categorieLabel.toLowerCase();
    if (categorie.includes('musculation')) return 'type-musculation';
    if (categorie.includes('course')) return 'type-cardio';
    if (categorie.includes('cardio')) return 'type-cardio';
    if (categorie.includes('yoga')) return 'type-yoga';
    if (categorie.includes('natation')) return 'type-natation';
    return 'type-default';
  }

  getTruncatedDescription(description: string): string {
    if (description.length <= 60) return description;
    return description.substring(0, 60) + '...';
  }

  formatDate(date: string | Date): string {
    return formatDate(new Date(date));
  }

  formatTemps(date: string | Date): string {
    return formatTemps(new Date(date));
  }

  marquerSeanceRealisee(seance: SeanceAvecCategorie) {
    const dialogRef = this.dialog.open(PopupSeanceRealiseeComponent, {
      width: '500px',
      maxWidth: '90vw',
      data: { seance },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.enregistrerSeanceDansHistorique(
          seance,
          result.tempsRealise,
          result.difficulte
        );
      }
    });
  }

  private enregistrerSeanceDansHistorique(
    seance: SeanceAvecCategorie,
    tempsRealise: number,
    difficulte: 'facile' | 'moyenne' | 'difficile'
  ) {
    const seanceForHistorique = {
      id: seance.id,
      label: seance.label,
      dateCreation: seance.dateCreation,
      description: seance.description,
      idUtilisateur: seance.idUtilisateur,
      exercice: seance.exercice,
      idCategorie: seance.idCategorie,
    };

    this.historiqueService
      .ajouterSeanceAHistorique(seanceForHistorique, tempsRealise, difficulte)
      .subscribe({
        next: (seanceEnregistree) => {
          this.toastService.succes(
            `Séance "${seance.label}" marquée comme réalisée ! Temps: ${tempsRealise}min, Difficulté: ${difficulte}`
          );
        },
        error: (error) => {
          console.error(
            "Erreur lors de l'enregistrement de la séance :",
            error
          );
          this.toastService.erreur(
            "Erreur lors de l'enregistrement de la séance dans l'historique"
          );
        },
      });
  }

  editerSeance(seance: SeanceAvecCategorie) {
    this.router.navigate(['/seances/modifier', seance.id]);
  }
}
