import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  mdp: string;
  role: string;
}

export interface Categorie {
  id: number;
  label: string;
  estVisible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private router: Router) {}

  recupererUtilisateurs(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/utilisateurs');
  }

  recupererUnUtilisateurParId(id: string): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/utilisateurs/${id}`);
  }
}
