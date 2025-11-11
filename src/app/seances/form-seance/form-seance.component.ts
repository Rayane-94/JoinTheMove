import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  SeancesService,
  Seance,
} from '../../shared/services/seances/seances.service';
import {
  CategorieService,
  Categorie,
} from '../../shared/services/categories/categories.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import {
  ExercicesService,
  Exercice,
} from '../../shared/services/exercices/exercices.service';

@Component({
  selector: 'app-form-seance',
  templateUrl: './form-seance.component.html',
  styleUrl: './form-seance.component.css',
  standalone: false,
})
export class FormSeanceComponent implements OnInit {
  seanceForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  categories: Categorie[] = [];
  exercices: Exercice[] = [];
  exercicesSelectionnes: Exercice[] = [];
  utilisateurConnecte: any = null;

  constructor(
    private fb: FormBuilder,
    private seancesService: SeancesService,
    private categorieService: CategorieService,
    private exercicesService: ExercicesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.seanceForm = this.fb.group({
      label: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      idCategorie: ['', [Validators.required]],
      exercicesSelectionnes: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.authService.getCurrentUserAsync().subscribe((user) => {
      if (user) {
        this.utilisateurConnecte = user;
        this.chargerCategories();
        this.chargerExercices();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  private chargerCategories() {
    this.categorieService.recupererCategories().subscribe({
      next: (categories) => {
        this.categories = categories.filter((cat) => cat.estVisible);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.errorMessage = 'Erreur lors du chargement des catégories';
      },
    });
  }

  onSubmit() {
    if (this.seanceForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.seanceForm.value;
      const currentUser = this.authService.getCurrentUser();

      if (!currentUser) {
        this.isLoading = false;
        this.errorMessage = 'Utilisateur non connecté';
        return;
      }

      const exerciceIds =
        this.exercicesSelectionnes.length > 0
          ? this.exercicesSelectionnes.map((ex) => ex.id)
          : null;

      const nouvelleSeance: Omit<Seance, 'id'> = {
        label: formValue.label,
        description: formValue.description,
        dateCreation: new Date(),
        idUtilisateur: String(currentUser.id),
        exercice: exerciceIds,
        idCategorie: formValue.idCategorie,
      };

      this.seancesService.ajouterSeance(nouvelleSeance as Seance).subscribe({
        next: (seance) => {
          this.isLoading = false;
          const message = exerciceIds
            ? `Séance créée avec succès avec ${exerciceIds.length} exercice${
                exerciceIds.length > 1 ? 's' : ''
              } !`
            : 'Séance créée avec succès !';
          this.successMessage = message;
          setTimeout(() => {
            this.router.navigate(['/seances']);
          }, 200);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la création de la séance';
          console.error('Erreur:', error);
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.seanceForm.controls).forEach((field) => {
      const control = this.seanceForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  onCancel() {
    this.router.navigate(['/seances']);
  }

  getFieldError(fieldName: string): string {
    const field = this.seanceForm.get(fieldName);
    if (field?.hasError('required')) {
      switch (fieldName) {
        case 'label':
          return 'Le nom de la séance est requis';
        case 'idCategorie':
          return 'La catégorie est requise';
        default:
          return `${fieldName} est requis`;
      }
    }
    if (field?.hasError('minlength')) {
      const requiredLength = field.errors?.['minlength']?.requiredLength;
      switch (fieldName) {
        case 'label':
          return `Le nom doit contenir au moins ${requiredLength} caractères`;
        default:
          return `${fieldName} doit contenir au moins ${requiredLength} caractères`;
      }
    }
    return '';
  }

  private chargerExercices(): void {
    if (this.utilisateurConnecte) {
      this.exercicesService
        .recupererExercicesParUtilisateur(this.utilisateurConnecte.id)
        .subscribe({
          next: (exercices) => {
            this.exercices = exercices;
          },
          error: (error) => {
            console.error('Erreur lors du chargement des exercices:', error);
          },
        });
    }
  }

  get exercicesFormArray(): FormArray {
    return this.seanceForm.get('exercicesSelectionnes') as FormArray;
  }

  ajouterExercice(exercice: Exercice): void {
    if (!this.exercicesSelectionnes.find((ex) => ex.id === exercice.id)) {
      this.exercicesSelectionnes.push(exercice);
      this.exercicesFormArray.push(new FormControl(exercice.id));
    }
  }

  supprimerExercice(exercice: Exercice): void {
    const index = this.exercicesSelectionnes.findIndex(
      (ex) => ex.id === exercice.id
    );
    if (index > -1) {
      this.exercicesSelectionnes.splice(index, 1);
      this.exercicesFormArray.removeAt(index);
    }
  }

  creerNouvelExerciceRapide(): void {
    this.router.navigate(['/exercices/nouveau'], {
      queryParams: { retour: '/seances/nouvelle' },
    });
  }

  deplacerExercice(exercice: Exercice, direction: 'up' | 'down'): void {
    const currentIndex = this.exercicesSelectionnes.findIndex(
      (ex) => ex.id === exercice.id
    );
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < this.exercicesSelectionnes.length) {
      [
        this.exercicesSelectionnes[currentIndex],
        this.exercicesSelectionnes[newIndex],
      ] = [
        this.exercicesSelectionnes[newIndex],
        this.exercicesSelectionnes[currentIndex],
      ];

      const currentControl = this.exercicesFormArray.at(currentIndex);
      const newControl = this.exercicesFormArray.at(newIndex);
      this.exercicesFormArray.setControl(currentIndex, newControl);
      this.exercicesFormArray.setControl(newIndex, currentControl);
    }
  }

  estExerciceSelectionne(exerciceId: string): boolean {
    return this.exercicesSelectionnes.some((ex) => ex.id === exerciceId);
  }

  estExerciceNonSelectionne(exerciceId: string): boolean {
    return !this.exercicesSelectionnes.some((ex) => ex.id === exerciceId);
  }
}
