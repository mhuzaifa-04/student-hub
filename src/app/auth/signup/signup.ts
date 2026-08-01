import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

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
    private profileService: ProfileService,
    private router: Router
  ) {

    this.signupForm = this.fb.nonNullable.group({

      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

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
        Validators.required
      ]

    });

  }


  async onSubmit(): Promise<void> {

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const {
      fullName,
      email,
      password,
      confirmPassword
    } = this.signupForm.getRawValue();


    // Password validation
    if (password !== confirmPassword) {

      this.errorMessage =
        'Passwords do not match.';

      return;

    }


    this.loading = true;

    try {

      // Create auth user
     const { data, error } =
  await this.authService.signUp(
    fullName,
    email,
    password
  );

      if (error) {

        this.errorMessage = error.message;

        console.error(
          'Signup Error:',
          error
        );

        return;
      }

// console
//       .log(
//         'Signup successful:',
//         data
//       );


     

      // Email confirmation enabled
      if (!data.session) {

        this.successMessage =
          'Account created successfully. Please verify your email before logging in.';

        return;

      }


      // Direct login
      await this.router.navigate([
        '/dashboard'
      ]);

    }

    catch (error) {

      console.error(
        'Unexpected signup error:',
        error
      );

      this.errorMessage =
        'Something went wrong. Please try again.';

    }

    finally {

      this.loading = false;

    }

  }

}