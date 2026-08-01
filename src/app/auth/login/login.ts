import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  loading = false;
  errorMessage = '';

  loginForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
      private profileService: ProfileService,
    private router: Router
  ) 
  
    
  
  {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],

      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  

async onSubmit(): Promise<void> {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  const { email, password } =
    this.loginForm.getRawValue();

  const { data, error } =
    await this.authService.login(
      email,
      password
    );

  if (error) {
    this.loading = false;
    this.errorMessage = error.message;
    console.error('Login error:', error);
    return;
  }

  // Make sure a session was created
  if (!data.session) {
    this.loading = false;
    this.errorMessage = 'Unable to create login session.';
    return;
  }

  // console.log('Logged in:', data.user);


  // Get logged-in user's profile
  const {
    data: profile,
    error: profileError
  } = await this.profileService.getCurrentProfile();


  if (profileError || !profile) {

    this.loading = false;

    console.error(
      'Profile loading failed:',
      profileError
    );

    this.errorMessage =
      'Unable to load user profile.';

    return;
  }


  this.loading = false;


  // Redirect based on role
  if (profile.role === 'ADMIN') {

    await this.router.navigate([
      '/admin'
    ]);

  } else {

    await this.router.navigate([
      '/dashboard'
    ]);

  }

}


}