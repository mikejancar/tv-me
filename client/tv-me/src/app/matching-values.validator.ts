import { AbstractControl, ValidatorFn } from '@angular/forms';

export function matchingValuesValidator(controlToMatch: AbstractControl): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    return control.value !== controlToMatch.value ? { matchingValues: { value: 'Values do not match' } } : null;
  };
}
