import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Task } from '../models/Task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private supabaseService: SupabaseService
  ) { }


async createTask(task: Task) {

  const {
    data: { user },
    error: userError
  } = await this.supabaseService.supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User is not authenticated');
  }

  return await this.supabaseService.supabase
    .from('TASKS')
    .insert([
      {
        ...task,
        user_id: user.id
      }
    ])
    .select();
}


 async getTasks() {

  return await this.supabaseService.supabase
    .from('TASKS')
    .select('*')
    .order('created_at', { ascending: false });

}
  
  async updateTask(id: string, task: Partial<Task>) {
  return await this.supabaseService.supabase
    .from('TASKS')
    .update(task)
    .eq('id', id);
}

async deleteTask(id: string) {
  return await this.supabaseService.supabase
    .from('TASKS')
    .delete()
    .eq('id', id);
}
}