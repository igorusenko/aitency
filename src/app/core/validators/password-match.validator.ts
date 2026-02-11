import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn =
  (control: AbstractControl) => {
    const passwordCtrl = control.get('password');
    const repeatCtrl = control.get('confirmPassword');

    if (!passwordCtrl || !repeatCtrl) return null;

    if (passwordCtrl.value !== repeatCtrl.value) {
      repeatCtrl.setErrors({ passwordMismatch: true });
    } else {
      repeatCtrl.setErrors(null);
    }

    return null;
  };
