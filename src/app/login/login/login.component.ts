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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      mdp: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.authService
      .login({
        email: this.loginForm.value.email,
        mdp: this.loginForm.value.mdp,
      })
      .subscribe({
        next: (response: any) => {
          if (response && response.length > 0) {
            this.authService.user = response[0];
            this.authService.saveUser();
            this.router.navigate(['/dashboard']);
          } else {
            alert('Email ou mot de passe incorrect');
          }
        },
        error: (error) => {
          console.error('Erreur de connexion:', error);
          alert('Erreur de connexion');
        },
      });
  }
}
