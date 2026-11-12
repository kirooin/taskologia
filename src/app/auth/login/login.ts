import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
  standalone: true,
})
export class Login {
  loginForm = {
    email: '',
    password: '',
  };

  login(form: NgForm) {
    if (form.invalid) {
      return
    }
    console.log(this.loginForm);
  }
}
