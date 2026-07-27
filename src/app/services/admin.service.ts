import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    private supabaseService: SupabaseService
  ) {}


  // Get all profiles
  async getUsers() {
    return await this.supabaseService.supabase
      .from('PROFILES')
      .select('*')
      .order('created_at', { ascending: false });
  }

  async getResourceViewUrl(filePath: string) {

  return await this.supabaseService.supabase
    .storage
    .from('resources')
    .createSignedUrl(
      filePath,
      60 * 10
    );
}

  // Get all tasks
  async getTasks() {
    return await this.supabaseService.supabase
      .from('TASKS')
      .select('*')
      .order('created_at', { ascending: false });
  }


  // Get all notes
  async getNotes() {
    return await this.supabaseService.supabase
      .from('NOTES')
      .select('*')
      .order('created_at', { ascending: false });
  }


  // Get all resources
  async getResources() {
    return await this.supabaseService.supabase
      .from('RESOURCES')
      .select('*')
      .order('created_at', { ascending: false });
  }

}