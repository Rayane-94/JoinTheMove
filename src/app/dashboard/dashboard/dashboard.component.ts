import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: false,
})
export class DashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}

  // ex event click / route a definir dans le html
  redirectTo(event: Event, route: string): void {
    event.preventDefault();
    this.router.navigate([route]);
  }
}
