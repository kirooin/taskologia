import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { passwordNameValidatorSignal } from './login-validation';
import {
  debounce,
  email,
  form,
  FormField,
  FormRoot,
  minLength,
  required,
} from '@angular/forms/signals';

type loginData = {
  email: string;
  password: string;
};

@Component({
  imports: [ReactiveFormsModule, FormRoot, FormField],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
  standalone: true,
})
export class Login {
  private fb = inject(FormBuilder);

  // loginForm = this.fb.group({
  //   email:[ '', [Validators.required, Validators.email]],
  //   password: ['', [Validators.required, Validators.minLength(6), passwordNameValidator]],
  // })

  loginModel = signal<loginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    debounce(schemaPath.email, 500);
    required(schemaPath.email, { message: 'Введите email' });
    email(schemaPath.email, { message: 'Введите корректный email' });

    required(schemaPath.password, { message: 'Введите пароль' });
    minLength(schemaPath.password, 6, { message: 'Пароль должен быть больше 6 символов' });
    passwordNameValidatorSignal(schemaPath.password);
  },
    {submission: {
      action: async (field) => {
        if (this.loginForm().invalid()) {
          this.loginForm().touched();
          return;
        }
        console.log(this.loginForm().value());
        this.loginModel.set({
          email: '',
          password: '',
        })
      }
      }});

  // get emailControl(): FormControl {
  //   return this.loginForm.get('email') as FormControl;
  // }
  //
  // get passwordControl(): FormControl {
  //   return this.loginForm.get('password') as FormControl;
  // }

  login() {
    if (this.loginForm().invalid()) {
      this.loginForm().touched();
      return;
    }
    console.log(this.loginForm().value());
  }
}
