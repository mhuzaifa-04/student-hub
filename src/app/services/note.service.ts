import { Injectable } from '@angular/core';

import { SupabaseService } from './supabase.service';
import { Note } from '../models/Note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(
    private supabaseService: SupabaseService
  ) {}


  // CREATE
  async createNote(note: Note) {

    const {
      data: { user },
      error: userError
    } = await this.supabaseService.supabase.auth.getUser();


    if (userError || !user) {

      throw new Error('User is not authenticated');

    }


    return await this.supabaseService.supabase
      .from('NOTES')
      .insert([
        {
          ...note,
          user_id: user.id
        }
      ])
      .select();

  }


  // READ
async getNotes() {

  const {
    data: { user },
    error: userError
  } = await this.supabaseService.supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error: userError ?? new Error('User not authenticated')
    };
  }

  return await this.supabaseService.supabase
    .from('NOTES')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: false
    });
}


  // UPDATE
  async updateNote(
    id: string,
    note: Partial<Note>
  ) {

    return await this.supabaseService.supabase
      .from('NOTES')
      .update({
        ...note,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

  }


  // DELETE
  async deleteNote(id: string) {

    return await this.supabaseService.supabase
      .from('NOTES')
      .delete()
      .eq('id', id);

  }

}