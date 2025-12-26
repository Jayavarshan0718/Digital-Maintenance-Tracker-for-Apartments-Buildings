# Deploy Backend to GitHub

## 1. Initialize Git Repository (if not already done)

```bash
# In the root directory
git init
git add .
git commit -m "Initial commit: Complete maintenance request backend"
```

## 2. Create GitHub Repository

1. Go to GitHub.com
2. Click "New Repository"
3. Name: `maintenance-request-system`
4. Description: `Complete maintenance request management system with Angular frontend and Node.js backend`
5. Make it Public or Private
6. Don't initialize with README (we already have one)

## 3. Connect Local Repository to GitHub

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/maintenance-request-system.git
git branch -M main
git push -u origin main
```

## 4. Team Collaboration Setup

### Branch Structure for 4-Person Team

```bash
# Create branches for each team member
git checkout -b resident-module
git checkout -b technician-module  
git checkout -b admin-module
git checkout -b backend-core

# Push all branches
git push origin resident-module
git push origin technician-module
git push origin admin-module
git push origin backend-core
```

### Team Member Assignments

**Person 1 - Resident Module (Frontend + Backend)**
- Branch: `resident-module`
- Files: 
  - Frontend: `src/app/resident/`
  - Backend: `backend/src/routes/requests.ts` (resident endpoints)
  - Backend: `backend/src/controllers/requestController.ts` (createRequest, getResidentRequests)

**Person 2 - Technician Module (Frontend + Backend)**
- Branch: `technician-module`
- Files:
  - Frontend: Create technician dashboard components
  - Backend: `backend/src/controllers/requestController.ts` (getTechnicianRequests, updateRequestStatus)

**Person 3 - Admin Module (Frontend + Backend)**
- Branch: `admin-module`
- Files:
  - Frontend: Create admin dashboard components
  - Backend: `backend/src/controllers/requestController.ts` (getAllRequests, assignTechnician)
  - Backend: `backend/src/controllers/userController.ts`

**Person 4 - Backend Core & Integration**
- Branch: `backend-core`
- Files:
  - Backend: `backend/src/database/`, `backend/src/middleware/`, `backend/src/server.ts`
  - Integration: Merge all branches, final testing

## 5. Development Workflow

### For Each Team Member:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/maintenance-request-system.git
cd maintenance-request-system

# Switch to your assigned branch
git checkout your-branch-name

# Install dependencies
cd backend
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Start development
npm run dev
```

### Daily Workflow:

```bash
# Pull latest changes
git pull origin main

# Work on your features
# ... make changes ...

# Commit and push
git add .
git commit -m "feat: implement [feature description]"
git push origin your-branch-name
```

### Integration Process:

```bash
# Person 4 (Backend Core) merges all branches
git checkout main
git pull origin main

# Merge each branch
git merge resident-module
git merge technician-module
git merge admin-module
git merge backend-core

# Test integration
npm run build
npm run dev

# Push integrated version
git push origin main
```

## 6. Project Structure in GitHub

```
maintenance-request-system/
├── backend/                 # Complete Node.js backend
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── middleware/      # Auth, validation, upload
│   │   ├── routes/          # API routes
│   │   ├── database/        # DB connection & schema
│   │   └── types/           # TypeScript interfaces
│   ├── package.json
│   └── README.md
├── src/                     # Angular frontend
│   └── app/
│       ├── resident/        # Person 1
│       ├── technician/      # Person 2 (to be created)
│       ├── admin/           # Person 3 (to be created)
│       └── services/
├── setup-backend.md         # Backend setup guide
└── README.md               # Main project README
```

## 7. Environment Setup for Team

Each team member needs:

1. **Node.js** (v16+)
2. **MySQL** (v8.0+)
3. **Angular CLI** (`npm install -g @angular/cli`)

### Database Setup:

```bash
# Each member runs this once
cd backend
npm run migrate
```

## 8. API Testing

Use the Swagger documentation at: `http://localhost:3000/api-docs`

### Test Credentials:
- **Admin**: admin@maintenance.com / admin123
- **Technician**: tech1@maintenance.com / admin123
- **Resident**: resident1@test.com / admin123

## 9. Integration Checklist

- [ ] All team members can run backend locally
- [ ] Database migrations work
- [ ] All API endpoints respond correctly
- [ ] Frontend connects to backend APIs
- [ ] File uploads work
- [ ] Authentication works across all modules
- [ ] Role-based access control works

## 10. Deployment (Optional)

For production deployment:

```bash
# Build for production
npm run build

# Set production environment variables
# Deploy to your preferred platform (Heroku, AWS, etc.)
```

## Support

- **Backend API Documentation**: http://localhost:3000/api-docs
- **Setup Issues**: Check `setup-backend.md`
- **Team Coordination**: Use GitHub Issues and Pull Requests