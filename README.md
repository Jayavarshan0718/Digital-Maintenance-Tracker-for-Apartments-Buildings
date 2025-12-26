# Digital Maintenance Tracker for Apartment Buildings

A comprehensive maintenance request management system built with **Angular** (Frontend) and **Node.js + TypeScript + Express** (Backend). This system supports three user roles: Residents, Technicians, and Administrators.

## 🚀 Features

### For Residents
- Submit maintenance requests with photos/documents
- Track request status in real-time
- View request history
- Priority-based categorization

### For Technicians  
- View assigned maintenance requests
- Update job status and add work notes
- Priority-based task management
- Mobile-friendly interface

### For Administrators
- Overview of all maintenance requests
- Assign technicians to requests
- Analytics and reporting dashboard
- User management

## 🏗️ Architecture

- **Frontend**: Angular 21+ with TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL with connection pooling
- **Authentication**: JWT-based with role-based access control
- **File Upload**: Multer with validation
- **API Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate limiting

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Angular CLI (`npm install -g @angular/cli`)

## 🛠️ Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/maintenance-request-system.git
cd maintenance-request-system
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate
npm run dev
```

### 3. Frontend Setup
```bash
# In a new terminal, from project root
npm install
ng serve
```

### 4. Access the Application
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs

## 🔐 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@maintenance.com | admin123 |
| Technician | tech1@maintenance.com | admin123 |
| Resident | resident1@test.com | admin123 |

## 📚 API Endpoints

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

## 👥 Team Development (4-Person Split)

### Person 1 - Resident Module
- **Frontend**: Maintenance request form, request history
- **Backend**: Create requests, view resident requests
- **Files**: `src/app/resident/`, resident API endpoints

### Person 2 - Technician Module
- **Frontend**: Technician dashboard, job management
- **Backend**: View assigned requests, update status
- **Files**: Technician components, technician API endpoints

### Person 3 - Admin Module
- **Frontend**: Admin dashboard, analytics, user management
- **Backend**: View all requests, assign technicians
- **Files**: Admin components, admin API endpoints

### Person 4 - Backend Core & Integration
- **Backend**: Database, authentication, middleware, deployment
- **Integration**: Merge all modules, testing, final deployment
- **Files**: Core backend infrastructure, CI/CD

## 🗂️ Project Structure

```
maintenance-request-system/
├── backend/                 # Node.js + TypeScript backend
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, validation, upload
│   │   ├── routes/          # API routes
│   │   ├── database/        # DB schema & connection
│   │   ├── types/           # TypeScript interfaces
│   │   └── server.ts        # Main server file
│   ├── uploads/             # File uploads
│   └── package.json
├── src/                     # Angular frontend
│   ├── app/
│   │   ├── resident/        # Resident components
│   │   ├── services/        # Angular services
│   │   └── app.routes.ts    # Routing configuration
│   └── main.ts
├── setup-backend.md         # Backend setup guide
├── deploy-to-github.md      # GitHub deployment guide
└── README.md
```

## 🔧 Development Scripts

### Backend
```bash
npm run dev      # Start development server
npm run build    # Build TypeScript
npm start        # Start production server
npm run migrate  # Run database migration
```

### Frontend
```bash
ng serve         # Start development server
ng build         # Build for production
ng test          # Run tests
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Run `npm run build`
3. Deploy to your preferred platform (Heroku, AWS, etc.)

### Frontend Deployment
1. Run `ng build --prod`
2. Deploy `dist/` folder to web server

## 🔒 Security Features

- JWT authentication with secure secret
- Role-based authorization
- Input validation with Joi
- File upload restrictions
- Rate limiting (100 requests/15min)
- CORS configuration
- Security headers with Helmet
- SQL injection prevention

## 📊 Database Schema

### Users Table
- id, email, password (hashed)
- firstName, lastName, role
- phoneNumber, apartmentNumber
- timestamps

### Maintenance Requests Table
- id, residentId, technicianId
- title, description, category, priority, status
- mediaUrls (JSON), workNotes
- timestamps

## 🧪 Testing

### API Testing
Use Swagger UI at `http://localhost:3000/api-docs` or tools like Postman.

### Example API Call
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"resident1@test.com","password":"admin123"}'

# Create Request
curl -X POST http://localhost:3000/api/requests \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Leaky Faucet" \
  -F "description=Kitchen faucet dripping" \
  -F "category=plumbing"
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Documentation**: Check `/api-docs` for API reference
- **Issues**: Use GitHub Issues for bug reports
- **Setup Help**: See `setup-backend.md`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for efficient apartment maintenance management**
