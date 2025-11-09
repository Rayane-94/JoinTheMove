import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'succes' | 'erreur' | 'avertissement' | 'info';
  duree?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  afficher(message: string, type: Toast['type'] = 'info', duree: number = 4000) {
    const toast: Toast = {
      id: this.generateId(),
      message,
      type,
      duree,
    };

    const toastsActuels = this.toastsSubject.value;
    this.toastsSubject.next([...toastsActuels, toast]);

    if (duree > 0) {
      setTimeout(() => {
        this.supprimer(toast.id);
      }, duree);
    }
  }

  succes(message: string, duree: number = 4000) {
    this.afficher(message, 'succes', duree);
  }

  erreur(message: string, duree: number = 5000) {
    this.afficher(message, 'erreur', duree);
  }

  avertissement(message: string, duree: number = 4000) {
    this.afficher(message, 'avertissement', duree);
  }

  info(message: string, duree: number = 4000) {
    this.afficher(message, 'info', duree);
  }

  supprimer(id: string) {
    const toastsActuels = this.toastsSubject.value;
    this.toastsSubject.next(toastsActuels.filter((toast) => toast.id !== id));
  }

  viderTout() {
    this.toastsSubject.next([]);
  }
}
