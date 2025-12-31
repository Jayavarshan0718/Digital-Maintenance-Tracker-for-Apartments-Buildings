import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceService } from '../../services/maintenance.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  
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
    this.loadAllRequests();
  }

  loadAllRequests() {
    this.loading = true;
    this.cdr.detectChanges();
    this.service.getAllRequests().subscribe({
      next: (data: any) => {
        console.log('Admin dashboard data:', data);
        this.requests = Array.isArray(data) ? data : [];
        this.calculateStats();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading requests:', error);
        this.requests = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats() {
    this.stats.total = this.requests.length;
    this.stats.pending = this.requests.filter(r => !r.status || r.status === 'Pending').length;
    this.stats.inProgress = this.requests.filter(r => r.status === 'In Progress').length;
    this.stats.completed = this.requests.filter(r => r.status === 'Completed').length;
  }

  updateRequestStatus(requestId: number, status: string) {
    this.service.updateRequestStatus(requestId, status).subscribe({
      next: () => {
        this.loadAllRequests();
      },
      error: (error) => {
        console.error('Error updating status:', error);
      }
    });
  }
}