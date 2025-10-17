import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: { id: number; nom: string; prenom: string; email: string; role: string; } | undefined;

  constructor(private http: HttpClient) { }

  addUser(user: { nom: string; prenom: string; email: string; mdp: string; role: string; }) {
    return this.http.post('http://localhost:3000/utilisateurs', user).subscribe();
  }

  login(user: { email: string; mdp: string; }) {
    return this.http.get('http://localhost:3000/utilisateurs?email=' + user.email + '&mdp=' + user.mdp);
  }

  logout() {
    this.user = undefined;
    localStorage.removeItem('user');
  }

  saveUser() {
    localStorage.setItem('user', '' + this.user?.id);
  }

  getSavedUser() {
    return localStorage.getItem('user');
  }

  isUserConnected() {
    if (this.user) {
      this.saveUser();
      return true;
    } else if (this.getSavedUser()) {
      this.getSavedUserInfo().subscribe((user: any) => {
        this.user = user[0];
        return true;
      });
    }
    return false;
  }
  
  private getSavedUserInfo() {
    return this.http.get('http://localhost:3000/utilisateurs?id=' + this.getSavedUser());
  }
}
