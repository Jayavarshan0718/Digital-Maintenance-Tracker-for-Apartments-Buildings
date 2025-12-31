import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  private apiUrl = 'http://localhost:3000/api/requests';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    const user = this.authService.getCurrentUser();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': user?.token ? `Bearer ${user.token}` : ''
      })
    };
  }

  createRequest(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  getRequestsByResident(id: number) {
    return this.http.get(`${this.apiUrl}/resident/${id}`, this.getHeaders());
  }

  getAllRequests() {
    return this.http.get(this.apiUrl, this.getHeaders());
  }

  updateRequestStatus(requestId: number, status: string) {
    return this.http.put(`${this.apiUrl}/${requestId}/status`, { status }, this.getHeaders());
  }

  getTechnicianRequests(technicianId: number) {
    return this.http.get(`${this.apiUrl}/technician/${technicianId}`, this.getHeaders());
  }
}
