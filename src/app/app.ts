import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,                         // ✅ REQUIRED
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']                  // ✅ FIXED (plural)
})
export class App {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    // Redirect to signin if not logged in
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
