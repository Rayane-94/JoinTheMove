import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SeancesService, Seance } from '../../shared/services/seances/seances.service';

@Component({
  selector: 'app-form-seance',
  templateUrl: './form-seance.component.html',
  styleUrl: './form-seance.component.css',
  standalone: false,
})
export class FormSeanceComponent {
  seanceForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private seancesService: SeancesService,
    private router: Router
  ) {
    this.seanceForm = this.fb.group({
      label: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateCreation: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.seanceForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.seanceForm.value;
      const nouvelleSeance: Omit<Seance, 'id'> = {
        label: formValue.label,
        description: formValue.description,
        dateCreation: new Date(formValue.dateCreation),
        idUtilisateur: null,
        exercice: null,
        categorie: null
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
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.seanceForm.controls).forEach(field => {
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
      return `${fieldName} est requis`;
    }
    if (field?.hasError('minlength')) {
      const requiredLength = field.errors?.['minlength']?.requiredLength;
      return `${fieldName} doit contenir au moins ${requiredLength} caractères`;
    }
    return '';
  }
}
