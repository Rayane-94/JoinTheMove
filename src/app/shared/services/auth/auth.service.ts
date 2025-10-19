import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user:
    | { id: string; nom: string; prenom: string; email: string; role: string }
    | undefined;
  private apiUrl = 'http://localhost:3000/utilisateurs';

  constructor(private http: HttpClient, private router: Router) {}

  addUser(user: {
    nom: string;
    prenom: string;
    email: string;
    mdp: string;
    role: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  login(user: { email: string; mdp: string }): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}?email=${user.email}&mdp=${user.mdp}`
    );
  }

  logout(): void {
    this.user = undefined;
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  saveUser(): void {
    if (this.user) {
      localStorage.setItem('user', this.user.id);
    }
  }

  getSavedUser(): string | null {
    return localStorage.getItem('user');
  }

  isUserConnected(): boolean {
    if (this.user) {
      this.saveUser();
      return true;
    } else if (this.getSavedUser()) {
      this.getSavedUserInfo().subscribe((user: any) => {
        if (user && user.length > 0) {
          this.user = user[0];
        }
      });
      return true;
    }
    return false;
  }

  private getSavedUserInfo(): Observable<any[]> {
    const userId = this.getSavedUser();
    return this.http.get<any[]>(`${this.apiUrl}?id=${userId}`);
  }

  getUserDisplayName(): string {
    return this.user ? `${this.user.prenom} ${this.user.nom}` : 'Utilisateur';
  }

  getUserFirstName(): string {
    return this.user?.prenom || '';
  }

  getUserLastName(): string {
    return this.user?.nom || '';
  }

  getCurrentUser() {
    return this.user;
  }
}
