export interface Profile {

  id: string;

  full_name?: string;

  role: 'USER' | 'ADMIN';

  created_at?: string;

}