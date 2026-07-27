import { ChangeDetectorRef, ApplicationRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileService } from '../services/profile.service';
import { TaskService } from '../services/task.service';
import { NoteService } from '../services/note.service';
import { ResourceService } from '../services/resource.service';
import { AuthService } from '../services/auth.service';

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

  // User
  userEmail = '';

  // Statistics
  totalTasks = 0;
  pendingTasks = 0;
  completedTasks = 0;

  totalNotes = 0;
  totalResources = 0;

  // Recent data
  recentTasks: Task[] = [];
  recentNotes: Note[] = [];

  loading = true;

  constructor(
    private taskService: TaskService,
    private noteService: NoteService,
    private resourceService: ResourceService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef,
    private profileService: ProfileService

    // private ngZone: NgZone
  ) { }


  // async ngOnInit(): Promise<void> {

  //   await this.loadDashboard();

  // }

  //   ngOnInit(): void {
  //   this.loadDashboard();
  // }

  //   async loadDashboard(): Promise<void> {

  //   this.loading = true;

  //   try {

  //     // USER
  //     const {
  //       data: { user }
  //     } = await this.authService.getUser();

  //     this.userEmail = user?.email ?? 'Student';


  //     // LOAD EVERYTHING
  //     const [
  //       taskResponse,
  //       noteResponse,
  //       resourceResponse
  //     ] = await Promise.all([
  //       this.taskService.getTasks(),
  //       this.noteService.getNotes(),
  //       this.resourceService.getResources()
  //     ]);


  //     // TASKS
  //     if (taskResponse.error) {

  //       console.error(
  //         'Task loading error:',
  //         taskResponse.error
  //       );

  //     } else {

  //       const tasks = taskResponse.data ?? [];

  //       this.totalTasks = tasks.length;

  //       this.pendingTasks = tasks.filter(
  //         task => task.status === 'PENDING'
  //       ).length;

  //       this.completedTasks = tasks.filter(
  //         task => task.status === 'COMPLETED'
  //       ).length;

  //       this.recentTasks = tasks.slice(0, 5);
  //     }


  //     // NOTES
  //     if (noteResponse.error) {

  //       console.error(
  //         'Note loading error:',
  //         noteResponse.error
  //       );

  //     } else {

  //       const notes = noteResponse.data ?? [];

  //       this.totalNotes = notes.length;

  //       this.recentNotes = notes.slice(0, 5);
  //     }


  //     // RESOURCES
  //     if (resourceResponse.error) {

  //       console.error(
  //         'Resource loading error:',
  //         resourceResponse.error
  //       );

  //     } else {

  //       this.totalResources =
  //         resourceResponse.data?.length ?? 0;
  //     }

  //   } catch (error) {

  //     console.error(
  //       'Dashboard loading failed:',
  //       error
  //     );

  //   } finally {

  //     // Finish loading FIRST
  //     this.loading = false;

  //     // Then render everything
  //     this.cdr.detectChanges();
  //   }
  // }

  async ngOnInit(): Promise<void> {

    console.log('Dashboard ngOnInit');

    await this.loadDashboard();
    //  await this.testProfile();


    console.log('Dashboard finished loading');

    console.log({
      totalTasks: this.totalTasks,
      totalNotes: this.totalNotes,
      totalResources: this.totalResources,
      recentTasks: this.recentTasks,
      recentNotes: this.recentNotes
    });
  }

// async testProfile(): Promise<void> {

//   const { data, error } =
//     await this.profileService.getCurrentProfile();

//   if (error) {
//     console.error('Profile error:', error);
//     return;
//   }

//   console.log('CURRENT PROFILE:', data);
//   console.log('ROLE:', data?.role);
// }

  async loadDashboard(): Promise<void> {

    
    try {

      // USER
      const {
        data: { user }
      } = await this.authService.getUser();

      this.userEmail = user?.email ?? 'Student';


      // FETCH ALL DATA
      const [
        taskResponse,
        noteResponse,
        resourceResponse
      ] = await Promise.all([
        this.taskService.getTasks(),
        this.noteService.getNotes(),
        this.resourceService.getResources()
      ]);

      console.log('TASK RESPONSE:', taskResponse);
      console.log('NOTE RESPONSE:', noteResponse);
      console.log('RESOURCE RESPONSE:', resourceResponse);



      console.log('TASK DATA:', taskResponse.data);
      console.log('NOTE DATA:', noteResponse.data);
      console.log('RESOURCE DATA:', resourceResponse.data);

      // TASKS
      if (taskResponse.error) {

        console.error(
          'Task loading error:',
          taskResponse.error
        );

      } else {

        const tasks = taskResponse.data ?? [];

        this.totalTasks = tasks.length;

        this.pendingTasks = tasks.filter(
          task => task.status === 'PENDING'
        ).length;

        this.completedTasks = tasks.filter(
          task => task.status === 'COMPLETED'
        ).length;

        this.recentTasks = tasks.slice(0, 5);
      }


      // NOTES
      if (noteResponse.error) {

        console.error(
          'Note loading error:',
          noteResponse.error
        );

      } else {

        const notes = noteResponse.data ?? [];

        this.totalNotes = notes.length;

        this.recentNotes = notes.slice(0, 5);
      }


      // RESOURCES
      if (resourceResponse.error) {

        console.error(
          'Resource loading error:',
          resourceResponse.error
        );

      } else {

        this.totalResources =
          resourceResponse.data?.length ?? 0;
      }


      // DEBUG
      console.log('Dashboard:', {
        user: this.userEmail,
        tasks: this.totalTasks,
        pending: this.pendingTasks,
        completed: this.completedTasks,
        notes: this.totalNotes,
        resources: this.totalResources
      });


      // // Force Angular application to render updated state
      // this.appRef.tick();

      // Render AFTER everything has been assigned
      this.cdr.detectChanges();


    } catch (error) {

      console.error(
        'Dashboard loading failed:',
        error
      );

    }

  }
}