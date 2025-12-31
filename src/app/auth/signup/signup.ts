import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignupComponent {
  formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'resident'
  };
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.formData.name || !this.formData.email || !this.formData.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.signup(this.formData).subscribe({
      next: (response: any) => {
        this.router.navigate(['/signin']);
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}