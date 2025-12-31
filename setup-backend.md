# Backend Setup Guide

## Quick Start

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment**
```bash
cp .env.example .env
```

4. **Configure database in .env file**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=maintenance_db
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_secret_key_here
```

5. **Run database migration**
```bash
npm run migrate
```

6. **Start development server**
```bash
npm run dev
```

## Test the API

Visit http://localhost:3000/api-docs for Swagger documentation

## Default Login Credentials

- **Admin**: admin@maintenance.com / admin123
- **Technician**: tech1@maintenance.com / admin123  
- **Resident**: resident1@test.com / admin123

## API Endpoints Summary

### Authentication
- POST `/api/auth/login` - Login
- POST `/api/auth/register` - Register

### Requests (Resident)
- POST `/api/requests` - Create maintenance request
- GET `/api/requests/resident/:id` - View request history

### Requests (Technician)  
- GET `/api/requests/technician/:id` - View assigned requests
- PUT `/api/requests/:id/status` - Update job status

### Requests (Admin)
- GET `/api/requests` - View all requests
- PUT `/api/requests/:id/assign` - Assign technician

### Users
- GET `/api/users/profile` - Get user profile
- GET `/api/users/dashboard-stats` - Get dashboard statistics
- GET `/api/users/technicians` - Get all technicians (Admin only)