import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: { id: string; nom: string; prenom: string; email: string; role: string; } | undefined;
  private apiUrl = 'http://localhost:3000/utilisateurs';

  constructor(private http: HttpClient) { }

  addUser(user: { nom: string; prenom: string; email: string; mdp: string; role: string; }): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  login(user: { email: string; mdp: string; }): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${user.email}&mdp=${user.mdp}`);
  }

  logout(): void {
    this.user = undefined;
    localStorage.removeItem('user');
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
}
