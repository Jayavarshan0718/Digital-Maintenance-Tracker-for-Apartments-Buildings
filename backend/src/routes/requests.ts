import { Router } from 'express';
import { RequestController } from '../controllers/requestController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { validateRequest, createRequestSchema, updateStatusSchema, assignTechnicianSchema } from '../middleware/validation';
import { upload } from '../middleware/upload';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Create maintenance request (Resident only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [plumbing, electrical, hvac, appliance, general, emergency]
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Request created successfully
 *       403:
 *         description: Access denied
 */
router.post('/', 
  authorizeRoles('resident'), 
  upload.array('files', 5), 
  validateRequest(createRequestSchema), 
  RequestController.createRequest
);

/**
 * @swagger
 * /api/requests/resident/{id}:
 *   get:
 *     summary: Get requests for a resident
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Requests retrieved successfully
 */
router.get('/resident/:id', 
  authorizeRoles('resident', 'admin'), 
  RequestController.getResidentRequests
);

/**
 * @swagger
 * /api/requests/technician/{id}:
 *   get:
 *     summary: Get requests assigned to a technician
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Requests retrieved successfully
 */
router.get('/technician/:id', 
  authorizeRoles('technician', 'admin'), 
  RequestController.getTechnicianRequests
);

export default router;
/**
 * @swagger
 * /api/requests/{id}/status:
 *   put:
 *     summary: Update request status (Technician/Admin only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [assigned, in-progress, completed, cancelled]
 *               workNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.put('/:id/status', 
  authorizeRoles('technician', 'admin'), 
  validateRequest(updateStatusSchema), 
  RequestController.updateRequestStatus
);

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Get all requests (Admin only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Requests retrieved successfully
 */
router.get('/', 
  authorizeRoles('admin'), 
  RequestController.getAllRequests
);

/**
 * @swagger
 * /api/requests/{id}/assign:
 *   put:
 *     summary: Assign technician to request (Admin only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               technicianId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Technician assigned successfully
 */
router.put('/:id/assign', 
  authorizeRoles('admin'), 
  validateRequest(assignTechnicianSchema), 
  RequestController.assignTechnician
);