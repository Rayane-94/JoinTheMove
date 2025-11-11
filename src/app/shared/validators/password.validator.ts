import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Validator pour mot de passe fort */

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null; // Ne valide pas si vide (géré par Validators.required)
    }

    // Vérifie la présence d'au moins une lettre
    const hasLetter = /[a-zA-Z]/.test(value);

    // Vérifie la présence d'au moins un chiffre
    const hasNumber = /[0-9]/.test(value);

    // Le mot de passe est valide si il contient lettres ET chiffres
    const passwordValid = hasLetter && hasNumber;

    return !passwordValid ? { passwordStrength: true } : null;
  };
}

/**
 *  Validator pour format email personnalisé (optionnel)
 */
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailValid = emailRegex.test(value);

    return !emailValid ? { invalidEmail: true } : null;
  };
}
