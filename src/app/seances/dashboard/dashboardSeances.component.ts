import { Component, OnInit } from '@angular/core';
import {
  SeancesService,
  SeanceAvecCategorie,
} from '../../shared/services/seances/seances.service';
import { PageEvent } from '@angular/material/paginator';
import { formatDate, formatTemps } from '../../shared/utils/date';
import { AuthService, User } from '../../shared/services/auth/auth.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'Vous devez être connecté pour voir vos séances';
      this.isLoading = false;
      return;
    }
    this.chargerSeances(currentUser);
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

  editerSeance(seance: SeanceAvecCategorie) {
    this.router.navigate(['/seances/modifier', seance.id]);
  }
}
