import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login';
import { SignupComponent } from './auth/signup/signup';

import { DashboardComponent } from './dashboard/dashboard';
import { TasksComponent } from './tasks/tasks';
import { NotesComponent } from './notes/notes';
import { ResourcesComponent } from './resources/resources';
import { Admin } from './admin/admin';

import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { ForgotPassword } from './auth/forgot-password/forgot-password';
import { ResetPassword } from './auth/reset-password/reset-password';


export const routes: Routes = [

  // -------------------------
  // PUBLIC
  // -------------------------

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'signup',
    component: SignupComponent
  },

  {
    path: "forgot-password",
    component: ForgotPassword
  },

  {
  path: 'reset-password',
  component: ResetPassword
},

  // -------------------------
  // USER
  // -------------------------

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  {
    path: 'tasks',
    component: TasksComponent,
    canActivate: [authGuard]
  },

  {
    path: 'notes',
    component: NotesComponent,
    canActivate: [authGuard]
  },

  {
    path: 'resources',
    component: ResourcesComponent,
    canActivate: [authGuard]
  },


  // -------------------------
  // ADMIN
  // -------------------------

  {
    path: 'admin',
    component: Admin,
    canActivate: [
      authGuard,
      adminGuard
    ]
  },


  // -------------------------
  // DEFAULT
  // -------------------------

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },


  // -------------------------
  // UNKNOWN URL
  // -------------------------

  {
    path: '**',
    redirectTo: 'login'
  }

];