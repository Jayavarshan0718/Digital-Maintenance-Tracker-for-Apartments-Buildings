# MySQL Setup Guide

## The Error You're Seeing

```
ER_ACCESS_DENIED_ERROR: Access denied for user 'root'@'localhost'
```

This means MySQL is either not installed, not running, or needs password configuration.

## Step 1: Install MySQL (if not installed)

### Windows
1. Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
2. Run the installer and choose "MySQL Server" 
3. During setup, set a root password (remember it!)
4. Complete the installation

### Alternative: Use XAMPP (Easier)
1. Download XAMPP from: https://www.apachefriends.org/
2. Install and open XAMPP Control Panel
3. Start "MySQL" service

## Step 2: Configure Your Password

Edit `backend/.env` file and set your MySQL password:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=maintenance_db
DB_USER=root
DB_PASSWORD=your_mysql_password_here
```

If you're using XAMPP, the default password is empty:
```env
DB_PASSWORD=
```

## Step 3: Create the Database

### Option A: Using MySQL Command Line
```bash
mysql -u root -p
```
Then run:
```sql
CREATE DATABASE maintenance_db;
EXIT;
```

### Option B: Using phpMyAdmin (XAMPP)
1. Open http://localhost/phpmyadmin
2. Click "New" on the left sidebar
3. Enter database name: `maintenance_db`
4. Click "Create"

### Option C: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Run: `CREATE DATABASE maintenance_db;`

## Step 4: Run Migrations

```bash
cd backend
npm run migrate
```

This will create the tables and insert sample data.

## Step 5: Start the Server

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server running on port 3000
📚 API Documentation: http://localhost:3000/api-docs
```

## Troubleshooting

### "Access denied" error
- Check your password in `.env` file
- Make sure MySQL service is running

### "Unknown database" error
- Create the database first (Step 3)

### "Connection refused" error
- MySQL service is not running
- Start MySQL from Services (Windows) or XAMPP

### Still having issues?
1. Open MySQL command line: `mysql -u root -p`
2. Enter your password
3. Run: `SHOW DATABASES;`
4. If you see the prompt, MySQL is working
5. Create database: `CREATE DATABASE maintenance_db;`

## Quick Test

After setup, test the API:
```bash
curl http://localhost:3000/health
```

Should return:
```json
{"status":"OK","timestamp":"...","uptime":...}
```