import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { passwordStrengthValidator } from '../../shared/validators/password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false,
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = ''; 
  successMessage: string = ''; 

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

    this.registerForm = this.fb.group(
      {
        nom: new FormControl('', Validators.required),
        prenom: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        mdp: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          passwordStrengthValidator(), // 🔐 Validator personnalisé
        ]),
        confirmPassword: new FormControl('', Validators.required),
        role: new FormControl('user', Validators.required),
      },
      { validators: [this.checkPasswords, this.checkUsernamePassword] }
    );
  }

  addUser() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.errorMessage = this.getErrorLabel;
      return;
    }

    const email = this.registerForm.value.email;

    // 📧 Vérifie d'abord si l'email existe déjà
    this.authService.checkEmailExists(email).subscribe({
      next: (exists) => {
        if (exists) {
          this.errorMessage = '❌ Cet email est déjà utilisé. Veuillez en choisir un autre.';
          this.registerForm.get('email')?.setErrors({ emailExists: true });
          return;
        }

        // ✅ Email disponible, on peut créer le compte
        this.authService
          .addUser({
            nom: this.registerForm.value.nom,
            prenom: this.registerForm.value.prenom,
            email: email,
            mdp: this.registerForm.value.mdp,
            role: this.registerForm.value.role,
          })
          .subscribe({
            next: (response) => {
              console.log('Utilisateur créé avec succès:', response);
              this.successMessage = '✅ Compte créé avec succès ! Redirection...';
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 1500);
            },
            error: (error) => {
              console.error('Erreur lors de la création:', error);
              this.errorMessage = '❌ Erreur lors de la création du compte. Veuillez réessayer.';
            },
          });
      },
      error: (error) => {
        console.error('Erreur lors de la vérification de l\'email:', error);
        this.errorMessage = '❌ Erreur de connexion au serveur. Veuillez réessayer.';
      },
    });
  }

  private checkPasswords(formGroup: FormGroup) {
    const password = formGroup.get('mdp');
    const confirmPassword = formGroup.get('confirmPassword');
    return password?.value !== confirmPassword?.value
      ? { missMatch: true }
      : null;
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
    const mdpControl = this.registerForm.controls?.['mdp'];
    const emailControl = this.registerForm.controls?.['email'];

    if (this.registerForm.errors?.['required'])
      return '⚠️ Tous les champs sont obligatoires';
    
    if (emailControl?.errors?.['email'])
      return '📧 Format d\'email invalide';
    
    if (emailControl?.errors?.['emailExists'])
      return '❌ Cet email est déjà utilisé';
    
    if (mdpControl?.errors?.['minlength'])
      return `🔐 Le mot de passe doit contenir au moins ${mdpControl?.errors?.['minlength']?.requiredLength} caractères`;
    
    if (mdpControl?.errors?.['passwordStrength'])
      return '🔐 Le mot de passe doit contenir au moins une lettre ET un chiffre';
    
    if (this.registerForm.errors?.['missMatch'])
      return '🔄 Les mots de passe ne correspondent pas';
    
    if (this.registerForm.errors?.['usernamePassword'])
      return '⚠️ Le mot de passe ne doit pas contenir votre email';
    
    return '❌ Un problème est survenu';
  }
}
