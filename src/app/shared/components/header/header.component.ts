import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/users/users.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: false,
})
export class HeaderComponent {
  @Input() activeRoute: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onLogout(): void {
    this.authService.logout();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getUserDisplayName(): string {
    return this.authService.getUserDisplayName();
  }
}
