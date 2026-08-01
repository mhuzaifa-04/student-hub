import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProfileService } from '../services/profile.service';
import { TaskService } from '../services/task.service';
import { NoteService } from '../services/note.service';
import { ResourceService } from '../services/resource.service';

import { Task } from '../models/Task';
import { Note } from '../models/Note';


@Component({
  selector: 'app-dashboard',
  standalone: true,

  imports: [
    CommonModule
    
  ],

  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  // =========================================
  // USER
  // =========================================

  userName = 'Student';


  // =========================================
  // STATISTICS
  // =========================================

  totalTasks = 0;
  pendingTasks = 0;
  completedTasks = 0;

  totalNotes = 0;
  totalResources = 0;


  // =========================================
  // RECENT DATA
  // =========================================

  recentTasks: Task[] = [];
  recentNotes: Note[] = [];


  // =========================================
  // PAGINATION
  // =========================================

  pageSize = 5;

  tasksPage = 1;
  notesPage = 1;


  // =========================================
  // STATE
  // =========================================

  loading = true;


  constructor(
    private profileService: ProfileService,
    private taskService: TaskService,
    private noteService: NoteService,
    private resourceService: ResourceService,
    private cdr: ChangeDetectorRef
  ) { }


  // =========================================
  // INITIALIZE
  // =========================================

  async ngOnInit(): Promise<void> {

    await this.loadDashboard();

  }


  // =========================================
  // LOAD DASHBOARD
  // =========================================

  async loadDashboard(): Promise<void> {

    this.loading = true;

    try {

      // -----------------------------------------
      // PROFILE
      // -----------------------------------------

      const {
        data: profile,
        error: profileError
      } =
        await this.profileService
          .getCurrentProfile();


      if (profileError) {

        console.error(
          'Profile loading error:',
          profileError
        );

      } else {

        this.userName =
          profile?.full_name?.trim()
          || '';

      }


      // -----------------------------------------
      // LOAD TASKS, NOTES & RESOURCES
      // -----------------------------------------

      const [
        taskResponse,
        noteResponse,
        resourceResponse
      ] = await Promise.all([

        this.taskService.getTasks(),

        this.noteService.getNotes(),

        this.resourceService.getResources()

      ]);


      // -----------------------------------------
      // TASKS
      // -----------------------------------------

      if (taskResponse.error) {

        console.error(
          'Task loading error:',
          taskResponse.error
        );

      } else {

        const tasks =
          taskResponse.data ?? [];


        this.totalTasks =
          tasks.length;


        this.pendingTasks =
          tasks.filter(
            task =>
              task.status === 'PENDING'
          ).length;


        this.completedTasks =
          tasks.filter(
            task =>
              task.status === 'COMPLETED'
          ).length;


        this.recentTasks =
          tasks;

      }


      // -----------------------------------------
      // NOTES
      // -----------------------------------------

      if (noteResponse.error) {

        console.error(
          'Note loading error:',
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


      // -----------------------------------------
      // RESOURCES
      // -----------------------------------------

      if (resourceResponse.error) {

        console.error(
          'Resource loading error:',
          resourceResponse.error
        );

      } else {

        this.totalResources =
          resourceResponse.data?.length
          ?? 0;

      }

    } catch (error) {

      console.error(
        'Dashboard loading failed:',
        error
      );

    } finally {

      this.loading = false;

      // Render all async Supabase updates
      this.cdr.detectChanges();

    }

  }


  // =========================================
  // TASK PAGINATION
  // =========================================

  get paginatedTasks(): Task[] {

    const start =
      (this.tasksPage - 1)
      * this.pageSize;


    return this.recentTasks.slice(
      start,
      start + this.pageSize
    );

  }


  get tasksTotalPages(): number {

    return Math.ceil(
      this.recentTasks.length
      / this.pageSize
    );

  }


  previousTasksPage(): void {

    if (this.tasksPage > 1) {

      this.tasksPage--;

    }

  }


  nextTasksPage(): void {

    if (
      this.tasksPage
      < this.tasksTotalPages
    ) {

      this.tasksPage++;

    }

  }


  // =========================================
  // NOTES PAGINATION
  // =========================================

  get paginatedNotes(): Note[] {

    const start =
      (this.notesPage - 1)
      * this.pageSize;


    return this.recentNotes.slice(
      start,
      start + this.pageSize
    );

  }


  get notesTotalPages(): number {

    return Math.ceil(
      this.recentNotes.length
      / this.pageSize
    );

  }


  previousNotesPage(): void {

    if (this.notesPage > 1) {

      this.notesPage--;

    }

  }


  nextNotesPage(): void {

    if (
      this.notesPage
      < this.notesTotalPages
    ) {

      this.notesPage++;

    }

  }

}