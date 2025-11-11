import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  ExercicesService,
  Exercice,
} from '../../shared/services/exercices/exercices.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { ToastService } from '../../shared/services/toast/toast.service';

@Component({
  selector: 'app-form-exercice',
  templateUrl: './form-exercice.component.html',
  styleUrl: './form-exercice.component.css',
  standalone: false,
})
export class FormExerciceComponent implements OnInit {
  exerciceForm: FormGroup;
  isEditMode = false;
  exerciceId: string | null = null;
  utilisateurConnecte: any = null;
  isLoading = false;
  routeRetour: string = '/exercices';

  constructor(
    private fb: FormBuilder,
    private exercicesService: ExercicesService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.exerciceForm = this.fb.group({
      label: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      nombreSerie: [
        3,
        [Validators.required, Validators.min(1), Validators.max(20)],
      ],
      nombreRepetition: [
        10,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      tempsRepos: [
        60,
        [Validators.required, Validators.min(10), Validators.max(600)],
      ],
    });
  }

  ngOnInit(): void {
    this.chargerUtilisateur();
    this.checkEditMode();
    this.checkReturnRoute();
  }

  private chargerUtilisateur(): void {
    this.authService.getCurrentUserAsync().subscribe((user) => {
      if (user) {
        this.utilisateurConnecte = user;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  private checkEditMode(): void {
    this.exerciceId = this.route.snapshot.paramMap.get('id');
    if (this.exerciceId) {
      this.isEditMode = true;
      this.chargerExercice();
    }
  }

  private chargerExercice(): void {
    if (this.exerciceId) {
      this.exercicesService
        .recupererUnExerciceParId(this.exerciceId)
        .subscribe({
          next: (exercice) => {
            this.exerciceForm.patchValue({
              label: exercice.label,
              description: exercice.description,
              nombreSerie: exercice.nombreSerie,
              nombreRepetition: exercice.nombreRepetition,
              tempsRepos: exercice.tempsRepos,
            });
          },
          error: (error) => {
            console.error("Erreur lors du chargement de l'exercice:", error);
            this.toastService.afficher(
              "Erreur lors du chargement de l'exercice",
              'erreur'
            );
            this.router.navigate(['/exercices']);
          },
        });
    }
  }

  onSubmit(): void {
    if (this.exerciceForm.valid && this.utilisateurConnecte) {
      this.isLoading = true;

      const exerciceData: Exercice = {
        id: this.exerciceId || Date.now().toString(),
        label: this.exerciceForm.value.label,
        description: this.exerciceForm.value.description,
        dateCreation: new Date(),
        idUtilisateur: this.utilisateurConnecte.id,
        nombreSerie: this.exerciceForm.value.nombreSerie,
        nombreRepetition: this.exerciceForm.value.nombreRepetition,
        tempsRepos: this.exerciceForm.value.tempsRepos,
      };

      const operation = this.isEditMode
        ? this.exercicesService.modifierExercice(exerciceData)
        : this.exercicesService.ajouterExercice(exerciceData);

      operation.subscribe({
        next: () => {
          const message = this.isEditMode
            ? 'Exercice modifié avec succès'
            : 'Exercice créé avec succès';
          this.toastService.afficher(message, 'succes');
          this.router.navigate([this.routeRetour]);
        },
        error: (error) => {
          console.error('Erreur lors de la sauvegarde:', error);
          this.toastService.afficher(
            "Erreur lors de la sauvegarde de l'exercice",
            'erreur'
          );
          this.isLoading = false;
        },
      });
    }
  }

  annuler(): void {
    this.router.navigate([this.routeRetour]);
  }

  getErrorMessage(field: string): string {
    const control = this.exerciceForm.get(field);
    if (control?.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Minimum ${minLength} caractères requis`;
    }
    if (control?.hasError('min')) {
      const min = control.errors?.['min'].min;
      return `Valeur minimale: ${min}`;
    }
    if (control?.hasError('max')) {
      const max = control.errors?.['max'].max;
      return `Valeur maximale: ${max}`;
    }
    return '';
  }

  isFieldInvalid(field: string): boolean {
    const control = this.exerciceForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  private checkReturnRoute(): void {
    const retour = this.route.snapshot.queryParamMap.get('retour');
    if (retour) {
      this.routeRetour = retour;
    }
  }

  obtenirTempsReposAffichage(): string {
    const tempsRepos = this.exerciceForm.get('tempsRepos')?.value;
    if (!tempsRepos) return '';

    if (tempsRepos < 60) {
      return `${tempsRepos} secondes`;
    }

    const minutes = Math.floor(tempsRepos / 60);
    const secondes = tempsRepos % 60;

    if (secondes === 0) {
      return `${minutes} min`;
    }

    return `${minutes} min ${secondes} sec`;
  }
}
