import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { pool } from '../database/connection';
import { LoginDto, RegisterDto, AuthResponse } from '../types';

// Database row interface (snake_case from MySQL)
interface UserRow {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'resident' | 'technician' | 'admin';
  phone_number?: string;
  apartment_number?: string;
  created_at: Date;
  updated_at: Date;
}

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginDto = req.body;

      // Find user by email
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      const users = rows as UserRow[];
      if (users.length === 0) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const user = users[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        res.status(500).json({ error: 'JWT secret not configured' });
        return;
      }

      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name
        },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as SignOptions
      );

      const response: AuthResponse = {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          phoneNumber: user.phone_number,
          apartmentNumber: user.apartment_number,
          createdAt: user.created_at,
          updatedAt: user.updated_at
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, role, phoneNumber, apartmentNumber }: RegisterDto = req.body;

      // Check if user already exists
      const [existingUsers] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if ((existingUsers as any[]).length > 0) {
        res.status(409).json({ error: 'User already exists with this email' });
        return;
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert new user
      const [result] = await pool.execute(
        `INSERT INTO users (email, password, first_name, last_name, role, phone_number, apartment_number) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [email, hashedPassword, firstName, lastName, role, phoneNumber || null, apartmentNumber || null]
      );

      const insertResult = result as any;
      const userId = insertResult.insertId;

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        res.status(500).json({ error: 'JWT secret not configured' });
        return;
      }

      const token = jwt.sign(
        { 
          id: userId, 
          email, 
          role,
          firstName,
          lastName
        },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as SignOptions
      );

      const response: AuthResponse = {
        token,
        user: {
          id: userId,
          email,
          firstName,
          lastName,
          role: role as 'resident' | 'technician' | 'admin',
          phoneNumber,
          apartmentNumber,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}