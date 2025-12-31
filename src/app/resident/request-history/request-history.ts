import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MaintenanceService } from '../../services/maintenance.service';

@Component({
  selector: 'app-request-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './request-history.html',
  styleUrl: './request-history.css'
})
export class RequestHistoryComponent implements OnInit {

  requests: any[] = [];
  loading = true;

  constructor(private service: MaintenanceService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('RequestHistoryComponent initialized');
    // Small delay to ensure proper initialization
    setTimeout(() => {
      this.loadRequests();
    }, 100);
  }

  loadRequests() {
    console.log('Loading requests...');
    this.loading = true;
    
    // Add timeout to prevent infinite loading
    setTimeout(() => {
      if (this.loading) {
        console.log('Request timed out');
        this.loading = false;
        this.requests = [];
      }
    }, 10000);
    
    this.service.getRequestsByResident(1).subscribe({
      next: (data: any) => {
        console.log('API Response received:', data);
        this.requests = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('API Error:', error);
        this.requests = [];
        this.loading = false;
        this.cdr.detectChanges();      }
    });
  }

  getStatusClass(status: string): string {
    if (!status) return 'pending';
    return status.toLowerCase().replace(' ', '-');
  }

  getPriorityClass(priority: string): string {
    if (!priority) return 'medium';
    return priority.toLowerCase();
  }

  getCompletedCount(): number {
    return this.requests.filter(r => r.status?.toLowerCase() === 'completed').length;
  }

  getPendingCount(): number {
    return this.requests.filter(r => !r.status || r.status.toLowerCase() === 'pending').length;
  }

  getInProgressCount(): number {
    return this.requests.filter(r => r.status?.toLowerCase() === 'in-progress').length;
  }

  getCategoryIcon(category: string): string {
    return category || 'Other';
  }

  getStatusIcon(status: string): string {
    return status || 'Pending';
  }

  getPriorityIcon(priority: string): string {
    return priority || 'Medium';
  }

  trackByRequestId(index: number, request: any): any {
    return request.id || index;
  }
}
