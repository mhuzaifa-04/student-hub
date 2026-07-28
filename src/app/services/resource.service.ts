import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Resource } from '../models/Resource';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(
    private supabaseService: SupabaseService
  ) {}


  // --------------------------------
  // UPLOAD FILE + CREATE RESOURCE
  // --------------------------------

  async uploadResource(
    file: File,
    title: string,
    subject: string
  ) {

    // Get authenticated user
    const {
      data: { user },
      error: userError
    } = await this.supabaseService.supabase.auth.getUser();


    if (userError || !user) {
      throw new Error('User is not authenticated');
    }


    // Generate unique file name
    const uniqueFileName =
      `${Date.now()}-${crypto.randomUUID()}-${file.name}`;


    // IMPORTANT:
    // First folder = user ID
    // Required by our Storage RLS policy
    const filePath =
      `${user.id}/${uniqueFileName}`;


    // Upload actual file to Storage
    const {
      data: uploadData,
      error: uploadError
    } = await this.supabaseService.supabase
      .storage
      .from('resources')
      .upload(
        filePath,
        file,
        {
          cacheControl: '3600',
          upsert: false
        }
      );


    if (uploadError) {

      console.error(
        'Storage upload failed:',
        uploadError
      );

      return {
        data: null,
        error: uploadError
      };
    }


    // Metadata that goes into PostgreSQL
    const resource: Resource = {

      title: title,

      subject: subject || undefined,

      file_name: file.name,

      file_path: uploadData.path,

      file_type: file.type,

      file_size: file.size,

      user_id: user.id

    };


    // Insert metadata
    const {
      data,
      error
    } = await this.supabaseService.supabase
      .from('RESOURCES')
      .insert([resource])
      .select()
      .single();


    // Database insert failed after file upload
    if (error) {

      console.error(
        'Resource metadata insert failed:',
        error
      );


      // Remove uploaded file so we don't
      // leave an orphaned Storage object.
      await this.supabaseService.supabase
        .storage
        .from('resources')
        .remove([
          uploadData.path
        ]);


      return {
        data: null,
        error
      };
    }


    return {
      data,
      error: null
    };
  }


  // --------------------------------
  // GET RESOURCES
  // --------------------------------

  async getResources() {

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
    .from('RESOURCES')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', {
      ascending: false
    });
}


  // --------------------------------
  // GET FILE URL
  // --------------------------------

  async getResourceUrl(filePath: string) {

  return await this.supabaseService.supabase
    .storage
    .from('resources')
    .createSignedUrl(
      filePath,
      60 * 10 // valid for 10 minutes
    );
}


  // --------------------------------
  // DELETE RESOURCE
  // --------------------------------

  async deleteResource(
    resource: Resource
  ) {

    if (!resource.id) {
      throw new Error(
        'Resource ID is missing'
      );
    }


    // Delete file first
    const {
      error: storageError
    } = await this.supabaseService.supabase
      .storage
      .from('resources')
      .remove([
        resource.file_path
      ]);


    if (storageError) {

      return {
        data: null,
        error: storageError
      };
    }


    // Delete metadata
    return await this.supabaseService.supabase
      .from('RESOURCES')
      .delete()
      .eq(
        'id',
        resource.id
      );
  }

  
}