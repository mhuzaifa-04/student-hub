import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login';
import { SignupComponent } from './auth/signup/signup';
import { DashboardComponent } from './dashboard/dashboard';
import { TasksComponent } from './tasks/tasks';
import { NotesComponent } from './notes/notes';
import { ResourcesComponent } from './resources/resources';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'notes',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'signup',
    component: SignupComponent
  },

  {
    path: 'dashboard',
    component: DashboardComponent
  },

  {
    path: 'tasks',
    component: TasksComponent
  },

  {
    path: "notes",
    component: NotesComponent
  },

  {
    path: "resources",
    component: ResourcesComponent
  }

];