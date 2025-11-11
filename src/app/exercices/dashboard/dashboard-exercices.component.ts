import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ExercicesService,
  Exercice,
} from '../../shared/services/exercices/exercices.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { ToastService } from '../../shared/services/toast/toast.service';

@Component({
  selector: 'app-dashboard-exercices',
  templateUrl: './dashboard-exercices.component.html',
  styleUrl: './dashboard-exercices.component.css',
  standalone: false,
})
export class DashboardExercicesComponent implements OnInit {
  exercices: Exercice[] = [];
  isLoading = true;
  errorMessage = '';
  utilisateurConnecte: any = null;

  constructor(
    private exercicesService: ExercicesService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerUtilisateur();
  }

  private chargerUtilisateur(): void {
    this.authService.getCurrentUserAsync().subscribe((user) => {
      if (user) {
        this.utilisateurConnecte = user;
        this.chargerExercices();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  private chargerExercices(): void {
    this.isLoading = true;
    this.exercicesService
      .recupererExercicesParUtilisateur(this.utilisateurConnecte.id)
      .subscribe({
        next: (exercices) => {
          this.exercices = exercices;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des exercices:', error);
          this.errorMessage = 'Erreur lors du chargement des exercices';
          this.isLoading = false;
        },
      });
  }

  creerNouvelExercice(): void {
    this.router.navigate(['/exercices/nouveau']);
  }

  modifierExercice(exercice: Exercice): void {
    this.router.navigate(['/exercices/modifier', exercice.id]);
  }

  supprimerExercice(exercice: Exercice): void {
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer l'exercice "${exercice.label}" ?`
      )
    ) {
      this.exercicesService.supprimerExercice(exercice.id).subscribe({
        next: () => {
          this.toastService.afficher('Exercice supprimé avec succès', 'succes');
          this.chargerExercices();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.toastService.afficher(
            "Erreur lors de la suppression de l'exercice",
            'erreur'
          );
        },
      });
    }
  }

  obtenirTempsReposFormate(secondes: number): string {
    if (secondes < 60) {
      return `${secondes}s`;
    }
    const minutes = Math.floor(secondes / 60);
    const secondesRestantes = secondes % 60;
    return secondesRestantes > 0
      ? `${minutes}m ${secondesRestantes}s`
      : `${minutes}m`;
  }

  calculerMoyenneSeries(): number {
    if (this.exercices.length === 0) return 0;
    const total = this.exercices.reduce((sum, ex) => sum + ex.nombreSerie, 0);
    return Math.round(total / this.exercices.length);
  }

  calculerMoyenneRepetitions(): number {
    if (this.exercices.length === 0) return 0;
    const total = this.exercices.reduce(
      (sum, ex) => sum + ex.nombreRepetition,
      0
    );
    return Math.round(total / this.exercices.length);
  }

  calculerMoyenneRepos(): string {
    if (this.exercices.length === 0) return '0s';
    const total = this.exercices.reduce((sum, ex) => sum + ex.tempsRepos, 0);
    const moyenne = Math.round(total / this.exercices.length);
    return this.obtenirTempsReposFormate(moyenne);
  }
}
