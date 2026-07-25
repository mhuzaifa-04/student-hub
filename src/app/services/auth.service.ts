import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private supabaseService: SupabaseService) {}

  async signUp(email: string, password: string) {
  return await this.supabaseService.supabase.auth.signUp({
    email,
    password
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
}