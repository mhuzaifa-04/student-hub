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

  pageSize = 3;

usersPage = 1;
tasksPage = 1;
notesPage = 1;
resourcesPage = 1;

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
          tasks;
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
          notes;
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
          resources;
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

// =========================
// ADMIN PAGINATION
// =========================
get paginatedUsers() {
  const start = (this.usersPage - 1) * this.pageSize;
  return this.users.slice(start, start + this.pageSize);
}

get usersTotalPages(): number {
  return Math.ceil(this.users.length / this.pageSize);
}


get paginatedTasks() {
  const start = (this.tasksPage - 1) * this.pageSize;
  return this.recentTasks.slice(start, start + this.pageSize);
}

get tasksTotalPages(): number {
  return Math.ceil(this.recentTasks.length / this.pageSize);
}


get paginatedNotes() {
  const start = (this.notesPage - 1) * this.pageSize;
  return this.recentNotes.slice(start, start + this.pageSize);
}

get notesTotalPages(): number {
  return Math.ceil(this.recentNotes.length / this.pageSize);
}


get paginatedResources() {
  const start = (this.resourcesPage - 1) * this.pageSize;
  return this.recentResources.slice(start, start + this.pageSize);
}

get resourcesTotalPages(): number {
  return Math.ceil(this.recentResources.length / this.pageSize);
}


///Navigation
previousUsersPage(): void {
  if (this.usersPage > 1) {
    this.usersPage--;
  }
}

nextUsersPage(): void {
  if (this.usersPage < this.usersTotalPages) {
    this.usersPage++;
  }
}

previousTasksPage(): void {
  if (this.tasksPage > 1) {
    this.tasksPage--;
  }
}

nextTasksPage(): void {
  if (this.tasksPage < this.tasksTotalPages) {
    this.tasksPage++;
  }
}

previousNotesPage(): void {
  if (this.notesPage > 1) {
    this.notesPage--;
  }
}

nextNotesPage(): void {
  if (this.notesPage < this.notesTotalPages) {
    this.notesPage++;
  }
}

previousResourcesPage(): void {
  if (this.resourcesPage > 1) {
    this.resourcesPage--;
  }
}

nextResourcesPage(): void {
  if (this.resourcesPage < this.resourcesTotalPages) {
    this.resourcesPage++;
  }
}

}