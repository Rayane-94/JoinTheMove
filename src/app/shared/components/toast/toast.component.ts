import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService, Toast } from '../../services/toast/toast.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 space-y-3">
      <div
        *ngFor="let toast of toasts"
        class="toast-item transform transition-all duration-300 ease-in-out"
        [class]="obtenirClassesToast(toast.type)"
      >
        <div class="flex items-center p-4 rounded-lg shadow-lg border max-w-sm">
          <div class="flex-shrink-0 mr-3">
            <mat-icon [class]="obtenirClassesIcone(toast.type)">
              {{ obtenirIcone(toast.type) }}
            </mat-icon>
          </div>

          <div class="flex-1 text-sm font-medium">
            {{ toast.message }}
          </div>

          <button
            (click)="supprimer(toast.id)"
            class="ml-3 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            title="Fermer"
          >
            <mat-icon class="text-sm">close</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-item {
        animation: slideInRight 0.3s ease-out;
      }

      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription!: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.subscription = this.toastService.toasts$.subscribe(
      (toasts: Toast[]) => {
        this.toasts = toasts;
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  supprimer(id: string) {
    this.toastService.supprimer(id);
  }

  obtenirClassesToast(type: Toast['type']): string {
    const classesDeBase = 'border-l-4';

    switch (type) {
      case 'succes':
        return `${classesDeBase} bg-green-50 border-green-400 text-green-800`;
      case 'erreur':
        return `${classesDeBase} bg-red-50 border-red-400 text-red-800`;
      case 'avertissement':
        return `${classesDeBase} bg-yellow-50 border-yellow-400 text-yellow-800`;
      case 'info':
      default:
        return `${classesDeBase} bg-blue-50 border-blue-400 text-blue-800`;
    }
  }

  obtenirClassesIcone(type: Toast['type']): string {
    switch (type) {
      case 'succes':
        return 'text-green-500';
      case 'erreur':
        return 'text-red-500';
      case 'avertissement':
        return 'text-yellow-500';
      case 'info':
      default:
        return 'text-blue-500';
    }
  }

  obtenirIcone(type: Toast['type']): string {
    switch (type) {
      case 'succes':
        return 'check_circle';
      case 'erreur':
        return 'error';
      case 'avertissement':
        return 'warning';
      case 'info':
      default:
        return 'info';
    }
  }
}
