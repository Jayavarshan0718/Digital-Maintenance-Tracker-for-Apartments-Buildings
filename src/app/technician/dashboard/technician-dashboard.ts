import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceService } from '../../services/maintenance.service';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technician-dashboard.html',
  styleUrls: ['./technician-dashboard.css']
})
export class TechnicianDashboardComponent implements OnInit {
  
  assignedRequests: any[] = [];
  loading = true;
  technicianId = 1;

  constructor(private service: MaintenanceService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadAssignedRequests();
  }

  loadAssignedRequests() {
    this.loading = true;
    this.cdr.detectChanges();
    this.service.getTechnicianRequests(this.technicianId).subscribe({
      next: (data: any) => {
        console.log('Technician dashboard data:', data);
        this.assignedRequests = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading requests:', error);
        this.assignedRequests = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateRequestStatus(requestId: number, status: string) {
    this.service.updateRequestStatus(requestId, status).subscribe({
      next: () => {
        this.loadAssignedRequests();
      },
      error: (error) => {
        console.error('Error updating status:', error);
      }
    });
  }

  startWork(requestId: number) {
    this.updateRequestStatus(requestId, 'In Progress');
  }

  completeWork(requestId: number) {
    this.updateRequestStatus(requestId, 'Completed');
  }
}