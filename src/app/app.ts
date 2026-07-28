import {
  Component
} from '@angular/core';

import {
  NavigationEnd,
  Router,
  RouterOutlet
} from '@angular/router';

import { filter } from 'rxjs';

import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-root',

  standalone: true,

  imports: [
    RouterOutlet,
    Navbar
  ],

  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  showNavbar = true;

  constructor(
    private router: Router
  ) {

    this.updateNavbar(
      this.router.url
    );

    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(event => {

        const navigation =
          event as NavigationEnd;

        this.updateNavbar(
          navigation.urlAfterRedirects
        );

      });

  }


  private updateNavbar(
    url: string
  ): void {

    this.showNavbar =
      !url.startsWith('/login') &&
      !url.startsWith('/signup') &&
      !url.startsWith('/forgot-password') &&
      !url.startsWith('/reset-password');

  }

}