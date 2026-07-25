import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignupComponent {

  loading = false;
  errorMessage = '';
  successMessage = '';

  signupForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.signupForm = this.fb.nonNullable.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        '',
        [
          Validators.required
        ]
      ]

    });

  }


  async onSubmit(): Promise<void> {

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const {
      email,
      password,
      confirmPassword
    } = this.signupForm.getRawValue();


    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }


    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';


    const { data, error } =
      await this.authService.signUp(email, password);


    this.loading = false;


    if (error) {

      this.errorMessage = error.message;

      console.error('Signup Error:', error);

      return;
    }


    console.log('Signup successful:', data);


    // If Supabase created a session immediately
    if (data.session) {

      await this.router.navigate(['/dashboard']);

      return;
    }


    // Email confirmation may be enabled
    this.successMessage =
      'Account created. Check your email to confirm your account.';

  }

}