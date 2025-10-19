import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private seancesService: SeancesService,
    private categorieService: CategorieService,
    private authService: AuthService,
    private router: Router
  ) {
    this.seanceForm = this.fb.group({
      label: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      idCategorie: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.chargerCategories();
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

      const nouvelleSeance: Omit<Seance, 'id'> = {
        label: formValue.label,
        description: formValue.description,
        dateCreation: new Date(),
        idUtilisateur: String(currentUser.id),
        exercice: null,
        idCategorie: parseInt(formValue.idCategorie),
      };

      this.seancesService.ajouterSeance(nouvelleSeance as Seance).subscribe({
        next: (seance) => {
          this.isLoading = false;
          this.successMessage = 'Séance créée avec succès !';
          setTimeout(() => {
            this.router.navigate(['/seances']);
          }, 2000);
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
}
