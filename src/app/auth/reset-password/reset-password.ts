import { Component } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {

  loading = false;
  errorMessage = '';

  resetForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.resetForm = this.fb.nonNullable.group({

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

    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }


    const {
      password,
      confirmPassword
    } = this.resetForm.getRawValue();


    if (password !== confirmPassword) {

      this.errorMessage =
        'Passwords do not match.';

      return;
    }


    this.loading = true;
    this.errorMessage = '';


    const { error } =
      await this.authService.updatePassword(
        password
      );


    this.loading = false;


    if (error) {

      console.error(
        'Password update failed:',
        error
      );

      this.errorMessage = error.message;

      return;
    }


    // End recovery/auth session
    await this.authService.logout();

    // Return to login
    await this.router.navigate([
      '/login'
    ]);

  }

}