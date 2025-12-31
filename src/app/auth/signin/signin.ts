import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signin.html',
  styleUrl: './signin.css'
})
export class SigninComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';

    console.log('Attempting signin with:', { email: this.email });

    this.authService.signin(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('Signin successful:', response);
        
        // Store user with token
        const userData = { ...response.user, token: response.token };
        this.authService.setCurrentUser(userData);
        
        // Clear form
        this.email = '';
        this.password = '';
        
        // Redirect based on user role
        switch(response.user.role) {
          case 'admin':
            this.router.navigate(['/admin']);
            break;
          case 'technician':
            this.router.navigate(['/technician']);
            break;
          default:
            this.router.navigate(['/new-request']);
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Signin error:', error);
        this.error = error.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}