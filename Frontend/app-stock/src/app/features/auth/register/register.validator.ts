import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador de contraseñas coincidentes rescatado de:
// https://blog.bitsrc.io/implementing-confirm-password-validation-in-angular-with-custom-validators-6acd01cb0288
// https://www.geeksforgeeks.org/angular-js/angular-confirm-password-validation-using-custom-validators/
// Funcion que toma dos valores tipo string y checkea si coinciden entre los dos.
// Los valores a validar son de tipo formBuilder(o sea, vienen desde el DOM).
// Retorna un objeto con valor mismatch = true o null, para que sea utilizado como un validator mas en el form Builder.
export const validadorPassword = (
  nombreControl: string,
  nombreCoincidenciaControl: string,
): ValidatorFn => {
  return (abstractControl: AbstractControl): ValidationErrors | null => {
    const control = abstractControl.get(nombreControl);
    const coincidirControl = abstractControl.get(nombreCoincidenciaControl);

    if (coincidirControl?.errors && !coincidirControl.errors['mismatch']) {
      return null;
    }

    if (control?.value !== coincidirControl?.value) {
      coincidirControl?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      coincidirControl?.setErrors(null);
      return null;
    }
  };
};
