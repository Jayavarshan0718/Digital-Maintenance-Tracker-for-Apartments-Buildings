import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/users/technicians:
 *   get:
 *     summary: Get all technicians (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Technicians retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 technicians:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/technicians', 
  authorizeRoles('admin'), 
  UserController.getTechnicians
);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 */
router.get('/profile', UserController.getProfile);

/**
 * @swagger
 * /api/users/dashboard-stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/dashboard-stats', UserController.getDashboardStats);

export default router;