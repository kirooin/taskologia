import { SchemaPath, validate } from '@angular/forms/signals';

export function passwordNameValidatorSignal(path: SchemaPath<string>) {
  validate(path, ({ value }) => {
    return /testologia/i.test(value())
      ? { kind: 'passwordNameForbidden', message: 'Имя не должно содержать testologia' }
      : null;
  });
}
