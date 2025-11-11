import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SeanceComplete } from '../../services/seances/seances.service';

export interface PopupDetailsSeanceData {
  seance: SeanceComplete;
}

@Component({
  selector: 'app-popup-details-seance',
  templateUrl: './popup-details-seance.component.html',
  styleUrl: './popup-details-seance.component.css',
  standalone: false,
})
export class PopupDetailsSeanceComponent {
  constructor(
    public dialogRef: MatDialogRef<PopupDetailsSeanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PopupDetailsSeanceData
  ) {}

  fermer(): void {
    this.dialogRef.close();
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

  calculerDureeTotaleEstimee(): string {
    if (
      !this.data.seance.exercicesDetails ||
      this.data.seance.exercicesDetails.length === 0
    ) {
      return 'Non estimée';
    }

    let dureeTotal = 0;
    this.data.seance.exercicesDetails.forEach((exercice) => {
      const tempsExecution =
        exercice.nombreSerie * exercice.nombreRepetition * 2;
      const tempsRepos = (exercice.nombreSerie - 1) * exercice.tempsRepos;
      dureeTotal += tempsExecution + tempsRepos;
    });

    return this.obtenirTempsReposFormate(dureeTotal);
  }

  calculerVolumeTotal(): { series: number; repetitions: number } {
    if (
      !this.data.seance.exercicesDetails ||
      this.data.seance.exercicesDetails.length === 0
    ) {
      return { series: 0, repetitions: 0 };
    }

    let totalSeries = 0;
    let totalRepetitions = 0;

    this.data.seance.exercicesDetails.forEach((exercice) => {
      totalSeries += exercice.nombreSerie;
      totalRepetitions += exercice.nombreSerie * exercice.nombreRepetition;
    });

    return { series: totalSeries, repetitions: totalRepetitions };
  }
}
