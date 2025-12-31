import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public authService: AuthService, private router: Router) {
    // Ensure we're on signin page if not logged in
    if (!this.authService.isLoggedIn() && this.router.url === '/') {
      this.router.navigate(['/signin']);
    }
  }

  isAuthPage(): boolean {
    const url = this.router.url;
    return url === '/signin' || url === '/signup';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
