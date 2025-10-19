import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Categorie {
  id: number;
  label: string;
  estVisible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CategorieService {
  constructor(private http: HttpClient) {}

  recupererCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>('http://localhost:3000/categories');
  }

  recupererUneCategorieParId(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`http://localhost:3000/categories/${id}`);
  }
}
