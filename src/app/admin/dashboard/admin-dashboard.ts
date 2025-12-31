import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceService } from '../../services/maintenance.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {

  requests: any[] = [];
  loading = true;

  stats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  };

  constructor(private service: MaintenanceService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Initial load
  }

  ngAfterViewInit() {
    // Load data after view is initialized
    setTimeout(() => {
      this.loadAllRequests();
    }, 100);
  }

  loadAllRequests() {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.service.getAllRequests().subscribe({
      next: (data: any) => {
        console.log('Admin data received:', data);
        this.requests = Array.isArray(data) ? data : [];
        this.calculateStats();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Admin loading error:', error);
        this.requests = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats() {
    this.stats.total = this.requests.length;
    this.stats.pending = this.requests.filter(r => !r.status || r.status === 'New').length;
    this.stats.inProgress = this.requests.filter(r => r.status === 'Assigned').length;
    this.stats.completed = this.requests.filter(r => r.status === 'Resolved').length;
  }

  updateRequestStatus(id: number, status: string) {
    console.log('Updating status:', id, status);
    this.service.updateRequestStatus(id, status).subscribe({
      next: (response) => {
        console.log('Status update successful:', response);
        this.loadAllRequests();
      },
      error: (error) => {
        console.error('Status update error:', error);
        alert('Failed to update status: ' + (error.error?.message || error.message));
      }
    });
  }

  getStatusClass(status: string): string {
    if (!status) return 'New';
    return status.toLowerCase().replace(' ', '-');
  }

  trackByRequestId(index: number, request: any): any {
    return request.id || index;
  }

  getPriorityClass(priority: string): string {
    if (!priority) return 'medium';
    return priority.toLowerCase();
  }
}

