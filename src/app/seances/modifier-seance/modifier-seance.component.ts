import { Component, OnInit } from '@angular/core';
import {
  Seance,
  SeancesService,
} from '../../shared/services/seances/seances.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Categorie,
  CategorieService,
} from '../../shared/services/categories/categories.service';
import { AuthService } from '../../shared/services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-modifier-seance',
  templateUrl: './modifier-seance.component.html',
  styleUrl: './modifier-seance.component.css',
  standalone: false,
})
export class ModifierSeanceComponent implements OnInit {
  seanceForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  categories: Categorie[] = [];
  seanceId: string | null = null;
  originalSeance: Seance | null = null;

  constructor(
    private fb: FormBuilder,
    private seancesService: SeancesService,
    private categorieService: CategorieService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
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

    this.route.params.subscribe((params) => {
      this.seanceId = params['id'];
      if (this.seanceId) {
        this.chargerSeance();
      } else {
        this.errorMessage = 'ID de séance invalide';
      }
    });

    this.chargerCategories();
  }

  private chargerSeance() {
    if (!this.seanceId) return;

    this.isLoading = true;
    this.seancesService.recupererUneSeanceParId(this.seanceId).subscribe({
      next: (seance) => {
        this.originalSeance = seance;

        const currentUser = this.authService.getCurrentUser();
        if (currentUser && seance.idUtilisateur !== currentUser.id) {
          this.errorMessage =
            "Vous n'êtes pas autorisé à modifier cette séance";
          this.isLoading = false;
          return;
        }

        this.seanceForm.patchValue({
          label: seance.label,
          description: seance.description,
          idCategorie: seance.idCategorie,
        });

        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement de la séance';
        this.isLoading = false;
        console.error('Erreur:', error);
      },
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
    if (this.seanceForm.valid && this.originalSeance) {
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

      const seanceModifiee: Seance = {
        ...this.originalSeance,
        label: formValue.label,
        description: formValue.description,
        idCategorie: parseInt(formValue.idCategorie),
      };

      console.log('Séance modifiée à envoyer:', seanceModifiee);

      this.seancesService.modifierSeance(seanceModifiee).subscribe({
        next: (seance) => {
          this.isLoading = false;
          this.successMessage = 'Séance modifiée avec succès !';
          setTimeout(() => {
            this.router.navigate(['/seances']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la modification de la séance';
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
