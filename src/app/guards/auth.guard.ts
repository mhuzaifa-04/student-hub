// import { inject } from '@angular/core';
// import {
//   CanActivateFn,
//   Router
// } from '@angular/router';

// import { SupabaseService } from '../services/supabase.service';

// export const authGuard: CanActivateFn = async (
//   route,
//   state
// ) => {

//   const supabaseService =
//     inject(SupabaseService);

//   const router =
//     inject(Router);


//   const {
//     data: { session }
//   } =
//     await supabaseService.supabase
//       .auth
//       .getSession();


//   // User is logged in
//   if (session) {
//     return true;
//   }


//   // User is NOT logged in
//   return router.createUrlTree([
//     '/login'
//   ]);

// };

import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  try {

    const { data, error } =
      await authService.getSession();

    console.log('GUARD SESSION:', data.session);

    if (error) {
      console.error('Session error:', error);
      return router.createUrlTree(['/login']);
    }

    if (data.session) {
      return true;
    }

    return router.createUrlTree(['/login']);

  } catch (error) {

    console.error('Auth guard error:', error);

    return router.createUrlTree(['/login']);
  }
};