import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { AdminService } from '../services/admin.service';
import { Profile } from '../models/Profile';
import { Task } from '../models/Task';
import { Note } from '../models/Note';
import { Resource } from '../models/Resource';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {

  // -------------------------
  // STATISTICS
  // -------------------------

  totalUsers = 0;
  totalTasks = 0;
  totalNotes = 0;
  totalResources = 0;

  // -------------------------
  // DATA
  // -------------------------

  users: Profile[] = [];
  recentTasks: Task[] = [];
  recentNotes: Note[] = [];
  recentResources: Resource[] = [];

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.loadAdminDashboard();
  }


  async loadAdminDashboard(): Promise<void> {

    try {

      const [
        userResponse,
        taskResponse,
        noteResponse,
        resourceResponse
      ] = await Promise.all([

        this.adminService.getUsers(),
        this.adminService.getTasks(),
        this.adminService.getNotes(),
        this.adminService.getResources()

      ]);


      // USERS
      if (userResponse.error) {

        console.error(
          'Users loading failed:',
          userResponse.error
        );

      } else {

        this.users =
          userResponse.data ?? [];

        this.totalUsers =
          this.users.length;
      }


      // TASKS
      if (taskResponse.error) {

        console.error(
          'Tasks loading failed:',
          taskResponse.error
        );

      } else {

        const tasks =
          taskResponse.data ?? [];

        this.totalTasks =
          tasks.length;

        this.recentTasks =
          tasks.slice(0, 5);
      }


      // NOTES
      if (noteResponse.error) {

        console.error(
          'Notes loading failed:',
          noteResponse.error
        );

      } else {

        const notes =
          noteResponse.data ?? [];

        this.totalNotes =
          notes.length;

        this.recentNotes =
          notes.slice(0, 5);
      }


      // RESOURCES
      if (resourceResponse.error) {

        console.error(
          'Resources loading failed:',
          resourceResponse.error
        );

      } else {

        const resources =
          resourceResponse.data ?? [];

        this.totalResources =
          resources.length;

        this.recentResources =
          resources.slice(0, 5);
      }


      // Required because of the async rendering
      // behaviour we encountered earlier.
      this.cdr.detectChanges();

    } catch (error) {

      console.error(
        'Admin dashboard loading failed:',
        error
      );

    }

  }

  async viewResource(resource: Resource): Promise<void> {

  if (!resource.file_path) {
    console.error('Resource file path missing');
    return;
  }

  const { data, error } =
    await this.adminService.getResourceViewUrl(
      resource.file_path
    );

  if (error) {
    console.error(
      'Unable to view resource:',
      error
    );

    alert('Unable to open resource.');
    return;
  }

  if (!data?.signedUrl) {
    console.error('Signed URL not generated');
    return;
  }

  window.open(
    data.signedUrl,
    '_blank',
    'noopener,noreferrer'
  );
}

  getUserName(userId?: string): string {

  if (!userId) {
    return 'Unknown User';
  }

  const user = this.users.find(
    profile => profile.id === userId
  );

  return user?.full_name || 'Student';
}

}