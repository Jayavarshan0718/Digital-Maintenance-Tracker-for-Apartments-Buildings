import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceService } from '../../services/maintenance.service';

@Component({
  selector: 'app-maintenance-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance-request.html',
  styleUrl: './maintenance-request.css'
})
export class MaintenanceRequestComponent {

  category = '';
  description = '';
  priority = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private service: MaintenanceService, private cdr: ChangeDetectorRef) {}

  submit() {
    // Validate required fields
    if (!this.category || !this.description || !this.priority) {
      alert('Please fill in all required fields (Category, Description, and Priority)');
      return;
    }

    if (this.category.trim() === '' || this.description.trim() === '' || this.priority.trim() === '') {
      alert('Please fill in all required fields properly');
      return;
    }

    const formData = new FormData();
    formData.append('resident_id', '1');
    formData.append('category', this.category.trim());
    formData.append('description', this.description.trim());
    formData.append('priority', this.priority.trim());
    
    console.log('Submitting form with:', {
      category: this.category,
      description: this.description,
      priority: this.priority
    });
    
    if (this.selectedFile) {
      formData.append('media', this.selectedFile);
    }

    this.service.createRequest(formData).subscribe({
      next: (response) => {
        console.log('Success:', response);
        this.showSuccessMessage();
        // Reset form after a short delay to ensure success message shows
        setTimeout(() => {
          this.resetForm();
        }, 100);
      },
      error: (error) => {
        console.error('Error creating request:', error);
        alert('Error: ' + (error.error?.message || error.message));
      }
    });
  }

  resetForm() {
    console.log('Resetting form - before:', { category: this.category, description: this.description, priority: this.priority });
    
    this.category = '';
    this.description = '';
    this.priority = '';
    this.selectedFile = null;
    this.imagePreview = null;
    
    // Clear file input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    // Force change detection
    this.cdr.detectChanges();
    
    console.log('Form reset completed - after:', { category: this.category, description: this.description, priority: this.priority });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  private showSuccessMessage() {
    // Create a modern success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">✅</span>
        <span>Request submitted successfully!</span>
      </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}
