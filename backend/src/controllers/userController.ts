import { Response } from 'express';
import { pool } from '../database/connection';
import { AuthRequest } from '../middleware/auth';

export class UserController {
  // Get all technicians (Admin only)
  static async getTechnicians(req: AuthRequest, res: Response): Promise<void> {
    try {
      const [rows] = await pool.execute(
        `SELECT id, email, first_name, last_name, phone_number, created_at
         FROM users 
         WHERE role = 'technician'
         ORDER BY first_name, last_name`
      );

      res.json({ technicians: rows });
    } catch (error) {
      console.error('Get technicians error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get user profile
  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      const [rows] = await pool.execute(
        `SELECT id, email, first_name, last_name, role, phone_number, apartment_number, created_at
         FROM users 
         WHERE id = ?`,
        [userId]
      );

      const users = rows as any[];
      if (users.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ user: users[0] });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get dashboard statistics
  static async getDashboardStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;

      let stats: any = {};

      if (userRole === 'admin') {
        // Admin dashboard stats
        const [totalRequests] = await pool.execute('SELECT COUNT(*) as count FROM maintenance_requests');
        const [newRequests] = await pool.execute('SELECT COUNT(*) as count FROM maintenance_requests WHERE status = "new"');
        const [inProgressRequests] = await pool.execute('SELECT COUNT(*) as count FROM maintenance_requests WHERE status IN ("assigned", "in-progress")');
        const [completedRequests] = await pool.execute('SELECT COUNT(*) as count FROM maintenance_requests WHERE status = "completed"');
        const [totalTechnicians] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "technician"');
        const [totalResidents] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "resident"');

        stats = {
          totalRequests: (totalRequests as any[])[0].count,
          newRequests: (newRequests as any[])[0].count,
          inProgressRequests: (inProgressRequests as any[])[0].count,
          completedRequests: (completedRequests as any[])[0].count,
          totalTechnicians: (totalTechnicians as any[])[0].count,
          totalResidents: (totalResidents as any[])[0].count
        };
      } else if (userRole === 'technician') {
        // Technician dashboard stats
        const [assignedRequests] = await pool.execute('SELECT COUNT(*) as count FROM maintenance_requests WHERE technician_id = ? AND status = "assigned"', [userId]);
        const [inProgressRequests] = await pool.execute('SELECT COUNT(*) as count FROM maintenance_requests WHERE technician_id = ? AND status = "in-progress"', [userId]);
        const [completedToday] = await pool.execute('SELECT COUNT(*) as count FROM maintenance_requests WHERE technician_id = ? AND status = "completed" AND DATE(completed_at) = CURDATE()', [userId]);

        stats = {
          assignedRequests: (assignedRequests as any[])[0].count,
          inProgressRequests: (inProgressRequests as any[])[0].count,
          completedToday: (completedToday as any[])[0].count
        };
      } else if (userRole === 'resident') {
        // Resident dashboard stats
        const [totalRequests] = await pool.execute('SELECT COUNT(*) as count FROM maintenance_requests WHERE resident_id = ?', [userId]);
        const [pendingRequests] = await pool.execute('SELECT COUNT(*) as count FROM maintenance_requests WHERE resident_id = ? AND status IN ("new", "assigned", "in-progress")', [userId]);
        const [completedRequests] = await pool.execute('SELECT COUNT(*) as count FROM maintenance_requests WHERE resident_id = ? AND status = "completed"', [userId]);

        stats = {
          totalRequests: (totalRequests as any[])[0].count,
          pendingRequests: (pendingRequests as any[])[0].count,
          completedRequests: (completedRequests as any[])[0].count
        };
      }

      res.json({ stats });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}