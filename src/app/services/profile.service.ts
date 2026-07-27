import { Injectable } from '@angular/core';

import { SupabaseService } from './supabase.service';

import { Profile } from '../models/Profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private supabaseService: SupabaseService
  ) {}


  async getCurrentProfile() {

    const {
      data: { user },
      error: userError
    } =
      await this.supabaseService.supabase
        .auth
        .getUser();


    if (userError || !user) {

      return {
        data: null,
        error:
          userError ??
          new Error('User not authenticated')
      };

    }


    return await this.supabaseService.supabase
      .from('PROFILES')
      .select('*')
      .eq('id', user.id)
      .single<Profile>();
  }


  async isAdmin(): Promise<boolean> {

    const {
      data,
      error
    } =
      await this.getCurrentProfile();


    if (error || !data) {
      return false;
    }


    return data.role === 'ADMIN';
  }

}