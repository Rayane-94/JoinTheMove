import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface PopupSeanceData {
  seance: any;
}

@Component({
  selector: 'app-popup-seance-realisee',
  templateUrl: './popup-seance-realisee.component.html',
  styleUrl: './popup-seance-realisee.component.css',
  standalone: false,
})
export class PopupSeanceRealiseeComponent implements OnInit {
  formulaire: FormGroup;
  difficultes = [
    { value: 'facile', label: 'Facile' },
    { value: 'moyenne', label: 'Moyenne' },
    { value: 'difficile', label: 'Difficile' },
  ];

  constructor(
    private dialogRef: MatDialogRef<PopupSeanceRealiseeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PopupSeanceData,
    private fb: FormBuilder
  ) {
    this.formulaire = this.fb.group({
      tempsRealise: [
        '',
        [Validators.required, Validators.min(1), Validators.max(480)],
      ],
      difficulte: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onValider(): void {
    if (this.formulaire.valid) {
      const resultat = {
        tempsRealise: this.formulaire.value.tempsRealise,
        difficulte: this.formulaire.value.difficulte,
      };
      this.dialogRef.close(resultat);
    }
  }

  onAnnuler(): void {
    this.dialogRef.close();
  }

  getDifficultyCardClass(value: string): string {
    const isSelected = this.formulaire.get('difficulte')?.value === value;
    const baseClass = 'border-2 transition-all duration-200';

    switch (value) {
      case 'facile':
        return `${baseClass} ${
          isSelected
            ? 'border-green-500 bg-green-50 shadow-lg'
            : 'border-green-200 hover:border-green-300 bg-green-25'
        }`;
      case 'moyenne':
        return `${baseClass} ${
          isSelected
            ? 'border-yellow-500 bg-yellow-50 shadow-lg'
            : 'border-yellow-200 hover:border-yellow-300 bg-yellow-25'
        }`;
      case 'difficile':
        return `${baseClass} ${
          isSelected
            ? 'border-red-500 bg-red-50 shadow-lg'
            : 'border-red-200 hover:border-red-300 bg-red-25'
        }`;
      default:
        return `${baseClass} border-gray-200 hover:border-gray-300`;
    }
  }

  getDifficultyIconClass(value: string): string {
    const isSelected = this.formulaire.get('difficulte')?.value === value;

    switch (value) {
      case 'facile':
        return isSelected
          ? 'bg-green-200 text-green-700'
          : 'bg-green-100 text-green-600';
      case 'moyenne':
        return isSelected
          ? 'bg-yellow-200 text-yellow-700'
          : 'bg-yellow-100 text-yellow-600';
      case 'difficile':
        return isSelected
          ? 'bg-red-200 text-red-700'
          : 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getDifficultyIcon(value: string): string {
    switch (value) {
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

  getDifficultyDescription(value: string): string {
    switch (value) {
      case 'facile':
        return 'Effort minimal';
      case 'moyenne':
        return 'Effort modéré';
      case 'difficile':
        return 'Effort intense';
      default:
        return '';
    }
  }
}
