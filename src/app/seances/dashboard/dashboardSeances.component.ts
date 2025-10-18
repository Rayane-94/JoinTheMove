import { Component, OnInit } from '@angular/core';
import {
  SeancesService,
  Seance,
} from '../../shared/services/seances/seances.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-seances-dashboard',
  templateUrl: './dashboardSeances.component.html',
  styleUrl: './dashboardSeances.component.css',
  standalone: false,
})
export class SeancesDashboardComponent implements OnInit {
  seances: Seance[] = [];
  seancesAffichees: Seance[] = [];
  isLoading = true;
  errorMessage = '';

  // Pagination
  pageSize = 5;
  pageIndex = 0;
  totalSeances = 0;
  pageSizeOptions = [5, 10, 25];

  constructor(private seancesService: SeancesService) {}

  ngOnInit() {
    this.chargerSeances();
  }

  chargerSeances() {
    this.isLoading = true;
    this.seancesService.recupererSeances().subscribe({
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

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getTypeIcon(label: string): string {
    if (label.toLowerCase().includes('musculation')) return 'fitness_center';
    if (label.toLowerCase().includes('course')) return 'directions_run';
    if (label.toLowerCase().includes('yoga')) return 'self_improvement';
    if (label.toLowerCase().includes('natation')) return 'pool';
    return 'sports';
  }

  getTypeClass(label: string): string {
    if (label.toLowerCase().includes('musculation')) return 'type-musculation';
    if (label.toLowerCase().includes('course')) return 'type-cardio';
    if (label.toLowerCase().includes('yoga')) return 'type-yoga';
    if (label.toLowerCase().includes('natation')) return 'type-natation';
    return 'type-default';
  }

  getTruncatedDescription(description: string): string {
    if (description.length <= 60) return description;
    return description.substring(0, 60) + '...';
  }
}
