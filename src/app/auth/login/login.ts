import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordNameValidator } from './login-validation';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
  standalone: true,
})
export class Login {

  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email:[ '', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), passwordNameValidator]],
  })

  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }


  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAsTouched();
      return
    }
    console.log(this.loginForm.value);
  }
}
