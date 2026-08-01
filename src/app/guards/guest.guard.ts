import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';

export const guestGuard: CanActivateFn = async () => {

  const authService = inject(AuthService);
  const profileService = inject(ProfileService);
  const router = inject(Router);

  try {

    const {
      data: { session }
    } = await authService.getSession();

    // No session → user can access login/signup
    if (!session) {
      return true;
    }

    // Logged in → find role
    const {
      data: profile,
      error
    } = await profileService.getCurrentProfile();

    // If profile cannot be loaded,
    // send authenticated user to dashboard
    if (error || !profile) {
      return router.createUrlTree(['/dashboard']);
    }

    // ADMIN
    if (profile.role === 'ADMIN') {
      return router.createUrlTree(['/admin']);
    }

    // USER
    return router.createUrlTree(['/dashboard']);

  } catch (error) {

    console.error('Guest Guard error:', error);

    // Allow auth page if session check itself fails
    return true;
  }
};