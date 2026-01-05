import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.details.map(detail => detail.message)
      });
      return;
    }
    
    next();
  };
};

// Validation schemas
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid('resident', 'technician').required(),
  phoneNumber: Joi.string().pattern(/^\d{10,15}$/).optional(),
  apartmentNumber: Joi.string().max(20).optional()
});

export const createRequestSchema = Joi.object({
  title: Joi.string().min(5).max(255).required(),
  description: Joi.string().min(10).max(2000).required(),
  category: Joi.string().valid('plumbing', 'electrical', 'hvac', 'appliance', 'general', 'emergency').required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium')
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid('assigned', 'in-progress', 'completed', 'cancelled').required(),
  workNotes: Joi.string().max(2000).optional()
});

export const assignTechnicianSchema = Joi.object({
  technicianId: Joi.number().integer().positive().required()
});