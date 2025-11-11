import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: false,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = ''; 
  isLoading: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isUserConnected()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      mdp: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  }

  login() {
    this.errorMessage = '';
    
    if (this.loginForm.invalid) {
      this.errorMessage = '⚠️ Veuillez remplir tous les champs correctement';
      return;
    }

    this.isLoading = true;

    this.authService
      .login({
        email: this.loginForm.value.email,
        mdp: this.loginForm.value.mdp,
      })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          
          if (response && response.length > 0) {
            this.authService.user = response[0];
            this.authService.saveUser();
            this.router.navigate(['/dashboard']);
          } else {
            // ❌ Email ou mot de passe incorrect
            this.errorMessage = '❌ Email ou mot de passe incorrect. Veuillez réessayer.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erreur de connexion:', error);
          this.errorMessage = '❌ Erreur de connexion au serveur. Veuillez réessayer.';
        },
      });
  }
}
