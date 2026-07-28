import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { ProfileService } from '../services/profile.service';

export const adminGuard: CanActivateFn = async (
  route,
  state
) => {

  const profileService =
    inject(ProfileService);

  const router =
    inject(Router);

  try {

    const { data, error } =
      await profileService.getCurrentProfile();

    // No profile / query failed
    if (error || !data) {

      console.error(
        'Admin guard profile error:',
        error
      );

      return router.createUrlTree([
        '/dashboard'
      ]);
    }

    // ADMIN
    if (data.role === 'ADMIN') {
      return true;
    }

    // Normal USER
    return router.createUrlTree([
      '/dashboard'
    ]);

  } catch (error) {

    console.error(
      'Admin guard error:',
      error
    );

    return router.createUrlTree([
      '/dashboard'
    ]);
  }

};