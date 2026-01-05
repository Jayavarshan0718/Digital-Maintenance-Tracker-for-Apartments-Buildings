import { Response } from 'express';
import { pool } from '../database/connection';
import { AuthRequest } from '../middleware/auth';
import { CreateRequestDto, UpdateRequestStatusDto, AssignTechnicianDto, MaintenanceRequest } from '../types';

export class RequestController {
  // Create new maintenance request (Resident only)
  static async createRequest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { title, description, category, priority = 'medium' }: CreateRequestDto = req.body;
      const residentId = req.user!.id;

      // Handle file uploads
      const files = req.files as Express.Multer.File[];
      const mediaUrls = files ? files.map(file => `/uploads/${file.filename}`) : [];

      const [result] = await pool.execute(
        `INSERT INTO maintenance_requests (resident_id, title, description, category, priority, media_urls) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [residentId, title, description, category, priority, JSON.stringify(mediaUrls)]
      );

      const insertResult = result as any;
      const requestId = insertResult.insertId;

      // Fetch the created request
      const [rows] = await pool.execute(
        `SELECT mr.*, u.first_name as resident_first_name, u.last_name as resident_last_name,
                u.apartment_number, u.phone_number as resident_phone
         FROM maintenance_requests mr
         JOIN users u ON mr.resident_id = u.id
         WHERE mr.id = ?`,
        [requestId]
      );

      const request = (rows as any[])[0];
      res.status(201).json({
        message: 'Maintenance request created successfully',
        request: {
          ...request,
          media_urls: request.media_urls ? JSON.parse(request.media_urls) : []
        }
      });
    } catch (error) {
      console.error('Create request error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get requests for a specific resident
  static async getResidentRequests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const residentId = req.user!.role === 'resident' ? req.user!.id : parseInt(req.params.id);

      // Ensure residents can only see their own requests
      if (req.user!.role === 'resident' && residentId !== req.user!.id) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const [rows] = await pool.execute(
        `SELECT mr.*, 
                CONCAT(u.first_name, ' ', u.last_name) as resident_name,
                u.apartment_number, u.phone_number as resident_phone,
                CONCAT(t.first_name, ' ', t.last_name) as technician_name,
                t.phone_number as technician_phone
         FROM maintenance_requests mr
         JOIN users u ON mr.resident_id = u.id
         LEFT JOIN users t ON mr.technician_id = t.id
         WHERE mr.resident_id = ?
         ORDER BY mr.created_at DESC`,
        [residentId]
      );

      const requests = (rows as any[]).map(request => ({
        ...request,
        media_urls: request.media_urls ? JSON.parse(request.media_urls) : []
      }));

      res.json({ requests });
    } catch (error) {
      console.error('Get resident requests error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  // Get requests assigned to a technician
  static async getTechnicianRequests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const technicianId = req.user!.role === 'technician' ? req.user!.id : parseInt(req.params.id);

      // Ensure technicians can only see their assigned requests
      if (req.user!.role === 'technician' && technicianId !== req.user!.id) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const [rows] = await pool.execute(
        `SELECT mr.*, 
                CONCAT(u.first_name, ' ', u.last_name) as resident_name,
                u.apartment_number, u.phone_number as resident_phone,
                u.email as resident_email
         FROM maintenance_requests mr
         JOIN users u ON mr.resident_id = u.id
         WHERE mr.technician_id = ?
         ORDER BY 
           CASE mr.priority 
             WHEN 'urgent' THEN 1 
             WHEN 'high' THEN 2 
             WHEN 'medium' THEN 3 
             WHEN 'low' THEN 4 
           END,
           mr.created_at ASC`,
        [technicianId]
      );

      const requests = (rows as any[]).map(request => ({
        ...request,
        media_urls: request.media_urls ? JSON.parse(request.media_urls) : []
      }));

      res.json({ requests });
    } catch (error) {
      console.error('Get technician requests error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update request status (Technician only)
  static async updateRequestStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const requestId = parseInt(req.params.id);
      const { status, workNotes }: UpdateRequestStatusDto = req.body;
      const technicianId = req.user!.id;

      // Verify the request is assigned to this technician
      const [rows] = await pool.execute(
        'SELECT technician_id FROM maintenance_requests WHERE id = ?',
        [requestId]
      );

      const requests = rows as any[];
      if (requests.length === 0) {
        res.status(404).json({ error: 'Request not found' });
        return;
      }

      if (req.user!.role === 'technician' && requests[0].technician_id !== technicianId) {
        res.status(403).json({ error: 'Request not assigned to you' });
        return;
      }

      // Update the request
      const updateFields = ['status = ?'];
      const updateValues = [status];

      if (workNotes) {
        updateFields.push('work_notes = ?');
        updateValues.push(workNotes);
      }

      if (status === 'completed') {
        updateFields.push('completed_at = NOW()');
      }

      updateValues.push(requestId.toString());

      await pool.execute(
        `UPDATE maintenance_requests SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      res.json({ message: 'Request status updated successfully' });
    } catch (error) {
      console.error('Update request status error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  // Get all requests (Admin only)
  static async getAllRequests(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const category = req.query.category as string;
      const offset = (page - 1) * limit;

      let whereClause = '';
      const queryParams: any[] = [];

      if (status) {
        whereClause += ' WHERE mr.status = ?';
        queryParams.push(status);
      }

      if (category) {
        whereClause += whereClause ? ' AND mr.category = ?' : ' WHERE mr.category = ?';
        queryParams.push(category);
      }

      // Get total count
      const [countRows] = await pool.execute(
        `SELECT COUNT(*) as total FROM maintenance_requests mr${whereClause}`,
        queryParams
      );
      const total = (countRows as any[])[0].total;

      // Get requests with pagination
      queryParams.push(limit, offset);
      const [rows] = await pool.execute(
        `SELECT mr.*, 
                CONCAT(u.first_name, ' ', u.last_name) as resident_name,
                u.apartment_number, u.phone_number as resident_phone,
                CONCAT(t.first_name, ' ', t.last_name) as technician_name,
                t.phone_number as technician_phone
         FROM maintenance_requests mr
         JOIN users u ON mr.resident_id = u.id
         LEFT JOIN users t ON mr.technician_id = t.id
         ${whereClause}
         ORDER BY mr.created_at DESC
         LIMIT ? OFFSET ?`,
        queryParams
      );

      const requests = (rows as any[]).map(request => ({
        ...request,
        media_urls: request.media_urls ? JSON.parse(request.media_urls) : []
      }));

      res.json({
        requests,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get all requests error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Assign technician to request (Admin only)
  static async assignTechnician(req: AuthRequest, res: Response): Promise<void> {
    try {
      const requestId = parseInt(req.params.id);
      const { technicianId }: AssignTechnicianDto = req.body;

      // Verify technician exists and has correct role
      const [techRows] = await pool.execute(
        'SELECT id FROM users WHERE id = ? AND role = ?',
        [technicianId, 'technician']
      );

      if ((techRows as any[]).length === 0) {
        res.status(400).json({ error: 'Invalid technician ID' });
        return;
      }

      // Update the request
      await pool.execute(
        'UPDATE maintenance_requests SET technician_id = ?, status = ? WHERE id = ?',
        [technicianId, 'assigned', requestId]
      );

      res.json({ message: 'Technician assigned successfully' });
    } catch (error) {
      console.error('Assign technician error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}