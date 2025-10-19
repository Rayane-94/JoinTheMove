import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: false,
})
export class HeaderComponent {
  @Input() activeRoute: string = '';

  constructor(private router: Router) {}

  onLogout() {
    // Logique de déconnexion ici
    console.log('Déconnexion');
    // Exemple : this.authService.logout();
    // this.router.navigate(['/login']);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
