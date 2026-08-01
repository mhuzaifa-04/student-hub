import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private supabaseService: SupabaseService) {}

 async signUp(
  fullName: string,
  email: string,
  password: string
) {

  return await this.supabaseService.supabase.auth.signUp({

    email,
    password,

    options: {

      data: {

        full_name: fullName

      }

    }

  });

}

  async login(email: string, password: string) {
    return await this.supabaseService.supabase.auth.signInWithPassword({
      
      email,
      password
    });
  }

  async logout() {
    return await this.supabaseService.supabase.auth.signOut();
  }

  async getSession() {
    return await this.supabaseService.supabase.auth.getSession();
  }

  async getUser() {
    return await this.supabaseService.supabase.auth.getUser();
  }

  async getUserName() {
    return await this.supabaseService.supabase.auth.getUser();
  }

  async resetPassword(email: string) {

  return await this.supabaseService.supabase.auth
    .resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/reset-password`
      }
    );
}

async updatePassword(password: string) {

  return await this.supabaseService.supabase.auth.updateUser({
    password: password
  });

}
}