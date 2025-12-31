import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceService } from '../../services/maintenance.service';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technician-dashboard.html',
  styleUrl: './technician-dashboard.css'
})
export class TechnicianDashboardComponent implements OnInit, AfterViewInit {

  assignedRequests: any[] = [];
  loading = true;
  technicianId = 1;

  constructor(private service: MaintenanceService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Initial setup
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadAssignedRequests();
    }, 100);
  }

  loadAssignedRequests() {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.service.getTechnicianRequests(this.technicianId).subscribe({
      next: (data: any) => {
        console.log('Technician data received:', data);
        this.assignedRequests = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Technician loading error:', error);
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
    this.updateRequestStatus(requestId, 'Assigned');
  }

  completeWork(requestId: number) {
    this.updateRequestStatus(requestId, 'Resolved');
  }

  getStatusClass(status: string): string {
    if (!status) return 'pending';
    return status.toLowerCase().replace(' ', '-');
  }

  trackByRequestId(index: number, request: any): any {
    return request.id || index;
  }
}
