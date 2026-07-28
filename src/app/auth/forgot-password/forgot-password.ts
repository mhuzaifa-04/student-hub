import { Component } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  loading = false;

  errorMessage = '';
  successMessage = '';

  forgotPasswordForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {

    this.forgotPasswordForm =
      this.fb.nonNullable.group({

        email: [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ]

      });

  }


  async onSubmit(): Promise<void> {

    if (this.forgotPasswordForm.invalid) {

      this.forgotPasswordForm.markAllAsTouched();

      return;
    }


    this.loading = true;

    this.errorMessage = '';
    this.successMessage = '';


    const { email } =
      this.forgotPasswordForm.getRawValue();


    const { error } =
      await this.authService.resetPassword(
        email
      );


    this.loading = false;


    if (error) {

      console.error(
        'Password reset error:',
        error
      );

      this.errorMessage =
        error.message;

      return;
    }


    this.successMessage =
      'Password reset link sent. Check your email.';

    this.forgotPasswordForm.reset();

  }

}