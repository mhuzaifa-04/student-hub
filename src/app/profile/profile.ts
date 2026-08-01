import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {

  email = '';
  role = '';

  editing = false;

  errorMessage = '';
  successMessage = '';

  profileForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService
  ) {

    this.profileForm =
      this.fb.nonNullable.group({

        fullName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(100)
          ]
        ]

      });

  }


  ngOnInit(): void {
    this.loadProfile();
  }


  async loadProfile(): Promise<void> {

    this.errorMessage = '';

    const {
      data: { user },
      error: userError
    } = await this.authService.getUser();


    if (userError || !user) {

      console.error(
        'User loading failed:',
        userError
      );

      this.errorMessage =
        'Unable to load account information.';

      return;
    }


    this.email =
      user.email ?? '';


    const {
      data: profile,
      error: profileError
    } =
      await this.profileService.getCurrentProfile();


    if (profileError || !profile) {

      console.error(
        'Profile loading failed:',
        profileError
      );

      this.errorMessage =
        'Unable to load profile.';

      return;
    }


    this.role =
      profile.role ?? 'USER';


    this.profileForm.patchValue({

      fullName:
        profile.full_name ?? ''

    });

  }


  enableEdit(): void {

    this.editing = true;

    this.errorMessage = '';
    this.successMessage = '';

  }


  cancelEdit(): void {

    this.editing = false;

    // Restore database value
    this.loadProfile();

  }


  async updateProfile(): Promise<void> {

    if (this.profileForm.invalid) {

      this.profileForm.markAllAsTouched();

      return;
    }


    this.errorMessage = '';
    this.successMessage = '';


    const { fullName } =
      this.profileForm.getRawValue();


    const {
      data,
      error
    } =
      await this.profileService
        .updateCurrentProfile(fullName);


    if (error) {

      console.error(
        'Profile update failed:',
        error
      );

      this.errorMessage =
        'Unable to update profile.';

      return;
    }


    // console.log(
    //   'Profile updated:',
    //   data
    // );


    this.successMessage =
      'Profile updated successfully.';


    this.editing = false;

  }

}