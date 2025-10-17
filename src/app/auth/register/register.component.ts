import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nom: new FormControl('', Validators.required),
      prenom: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      mdp: new FormControl('', [Validators.required, Validators.minLength(4)]),
      confirmPassword: new FormControl('', Validators.required),
      role: new FormControl('user', Validators.required)
    }, { validators: [this.checkPasswords, this.checkUsernamePassword] });
  }

  addUser() {
    if (this.registerForm.invalid) return;
    this.authService.addUser({
      nom: this.registerForm.value.nom,
      prenom: this.registerForm.value.prenom,
      email: this.registerForm.value.email,
      mdp: this.registerForm.value.mdp,
      role: this.registerForm.value.role
<<<<<<< HEAD
    }).subscribe({
      next: (response) => {
        console.log('Utilisateur créé avec succès:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        alert('Erreur lors de la création du compte');
      }
    });
=======
    });
    this.router.navigate(['/login']);
>>>>>>> 080f0c3 (feat:Add route et debut register)
  }

  private checkPasswords(formGroup: FormGroup) {
    const password = formGroup.get('mdp');
    const confirmPassword = formGroup.get('confirmPassword');
    return password?.value !== confirmPassword?.value ? { missMatch: true } : null;
  }

  private checkUsernamePassword(formGroup: FormGroup) {
    const username = formGroup.get('email')?.value;
    const passwordValue = formGroup.get('mdp')?.value;
    const passwordControl = formGroup.get('mdp');
    if (!username || !passwordValue) return null;
    if (passwordValue.includes(username)) {
      passwordControl?.setErrors({ usernamePassword: true });
      return { usernamePassword: true };
    }
    return null;
  }

  get getErrorLabel() {
    if (this.registerForm.errors?.['required']) return 'Les champs sont obligatoires';
    if (!!this.registerForm.controls?.['mdp']?.errors?.['minlength']) return `La longueur minimal pour votre mot de passe est ${this.registerForm.controls?.['mdp']?.errors?.['minlength']?.requiredLength}`;
    if (this.registerForm.errors?.['missMatch']) return 'Les mots de passe ne correspondent pas';
    if (this.registerForm.errors?.['usernamePassword']) return 'Le mot de passe comporte des informations personnelles';
    return 'Un problème est survenu';
  }
}
