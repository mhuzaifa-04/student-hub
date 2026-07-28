import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  isAdmin = false;
  userName = '';

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.loadProfile();
  }


  async loadProfile(): Promise<void> {

    const { data, error } =
      await this.profileService.getCurrentProfile();

    if (error || !data) {
      console.error('Navbar profile error:', error);
      return;
    }

    this.userName =
      data.full_name || 'Student';

    this.isAdmin =
      data.role === 'ADMIN';

    this.cdr.detectChanges();
  }


  async logout(): Promise<void> {

    const { error } =
      await this.authService.logout();

    if (error) {
      console.error('Logout failed:', error);
      return;
    }

    await this.router.navigate(['/login']);
  }

}