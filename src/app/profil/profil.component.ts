import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css',
  standalone: false,
})
export class ProfilComponent implements OnInit {
  utilisateur: any = null;
  loading = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.chargerDonneesProfil();
  }

  private chargerDonneesProfil(): void {
    this.authService.getCurrentUserAsync().subscribe((user) => {
      if (user) {
        this.utilisateur = user;
        this.loading = false;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  deconnexion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
