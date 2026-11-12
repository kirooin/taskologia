import { FormControl, ValidationErrors } from '@angular/forms';

export function passwordNameValidator(control: FormControl): ValidationErrors | null {
  return /testologia/i.test(control.value) ? { passwordNameForbidden: true } : null;
}
