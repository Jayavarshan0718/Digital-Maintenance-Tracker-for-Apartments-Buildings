# Maintenance Request Backend API

A comprehensive Node.js + TypeScript + Express backend for a maintenance request management system supporting residents, technicians, and administrators.

## 🚀 Features

- **Role-based Authentication** (Resident, Technician, Admin)
- **JWT Token Security**
- **File Upload Support** (Images, Documents)
- **RESTful API Design**
- **MySQL Database Integration**
- **Input Validation & Error Handling**
- **API Documentation with Swagger**
- **Rate Limiting & Security Headers**

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone and navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
```

4. **Configure your .env file**
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=maintenance_db
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=24h

UPLOAD_PATH=uploads
MAX_FILE_SIZE=5242880

FRONTEND_URL=http://localhost:4200
```

5. **Database Setup**
```bash
# Create database and tables
npm run migrate
```

6. **Start Development Server**
```bash
npm run dev
```

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 🔐 Default Users

After running migration, these test users are available:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@maintenance.com | admin123 |
| Technician | tech1@maintenance.com | admin123 |
| Technician | tech2@maintenance.com | admin123 |
| Resident | resident1@test.com | admin123 |
| Resident | resident2@test.com | admin123 |

## 🛣️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Maintenance Requests
- `POST /api/requests` - Create request (Resident)
- `GET /api/requests/resident/:id` - Get resident requests
- `GET /api/requests/technician/:id` - Get technician requests
- `GET /api/requests` - Get all requests (Admin)
- `PUT /api/requests/:id/status` - Update request status
- `PUT /api/requests/:id/assign` - Assign technician (Admin)

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/technicians` - Get all technicians (Admin)
- `GET /api/users/dashboard-stats` - Get dashboard statistics

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, upload
│   ├── routes/          # API routes
│   ├── database/        # DB connection & schema
│   ├── types/           # TypeScript interfaces
│   ├── config/          # Swagger configuration
│   └── server.ts        # Main server file
├── uploads/             # File uploads directory
├── package.json
└── README.md
```

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run migrate  # Run database migration
npm test         # Run tests
```

## 🚀 Deployment

1. **Build the project**
```bash
npm run build
```

2. **Set production environment variables**

3. **Start the server**
```bash
npm start
```

## 🤝 Team Integration

This backend supports the 4-person team structure:

- **Person 1**: Resident APIs (`/api/requests`, `/api/auth`)
- **Person 2**: Technician APIs (`/api/requests/technician/*`)
- **Person 3**: Admin APIs (`/api/requests`, `/api/users/technicians`)
- **Person 4**: Core backend setup (Database, Auth, Integration)

## 📝 API Usage Examples

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"resident1@test.com","password":"admin123"}'
```

### Create Request
```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Leaky Faucet" \
  -F "description=Kitchen faucet is dripping" \
  -F "category=plumbing" \
  -F "priority=medium"
```

## 🔒 Security Features

- JWT Authentication
- Role-based Authorization
- Input Validation (Joi)
- Rate Limiting
- File Upload Restrictions
- CORS Configuration
- Security Headers (Helmet)

## 🐛 Troubleshooting

1. **Database Connection Issues**
   - Verify MySQL is running
   - Check database credentials in .env
   - Ensure database exists

2. **File Upload Issues**
   - Check uploads directory permissions
   - Verify MAX_FILE_SIZE setting

3. **CORS Issues**
   - Update FRONTEND_URL in .env
   - Check allowed origins in server.ts

