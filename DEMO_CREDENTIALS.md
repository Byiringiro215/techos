# TechOS Demo Credentials

## 🚀 Quick Start

### Step 1: Start Backend Server
```bash
cd server-nest
npm install
npm run start:dev
```
Backend will run on: `http://localhost:4000`

### Step 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on: `http://localhost:3000`

---

## 🎫 Demo Account Creation

### Method 1: Register via Frontend
1. Go to `http://localhost:3000`
2. Click "Register" or "Sign Up"
3. Fill in the form with these details:

```
Organization Name: Demo Company
Email: demo@techos.com
Password: Demo123456!
First Name: Demo
Last Name: User
```

### Method 2: Register via API (Postman/cURL)

**Using cURL:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "organizationName": "Demo Company",
    "email": "demo@techos.com",
    "password": "Demo123456!",
    "firstName": "Demo",
    "lastName": "User"
  }'
```

**Using Postman:**
- Method: POST
- URL: `http://localhost:4000/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "organizationName": "Demo Company",
  "email": "demo@techos.com",
  "password": "Demo123456!",
  "firstName": "Demo",
  "lastName": "User"
}
```

**✅ IMPORTANT:** Use **camelCase** for property names (organizationName, firstName, lastName), not snake_case.

---

## 🔐 Login Credentials

After registration, use these credentials to login:

```
Email: demo@techos.com
Password: Demo123456!
```

---

## 👥 Multiple Test Accounts

You can create multiple accounts for testing different roles:

### CEO Account
```
Organization: Demo Company
Email: ceo@techos.com
Password: CEO123456!
First Name: Chief
Last Name: Executive
Role: CEO
```

### Developer Account
```
Organization: Demo Company
Email: dev@techos.com
Password: Dev123456!
First Name: Jane
Last Name: Developer
Role: Software Engineer
```

### Product Manager Account
```
Organization: Demo Company
Email: pm@techos.com
Password: PM123456!
First Name: John
Last Name: Manager
Role: Product Manager
```

---

## 🧪 Test Data

After logging in, you can:

1. **Create Projects** - Use the Projects module to add test projects
2. **Create Tasks** - Add tasks to projects via the Kanban board
3. **Create Sprints** - Plan sprints for your projects
4. **Schedule Meetings** - Add meetings to the calendar
5. **Manage Contacts** - Add CRM contacts and deals
6. **Track Finances** - Create invoices and expense reports

---

## 🔧 API Testing with Bearer Token

After login, you'll receive a JWT token. Use it for authenticated requests:

**Login Request:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@techos.com",
    "password": "Demo123456!"
  }'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "demo@techos.com",
    "firstName": "Demo",
    "lastName": "User"
  }
}
```

**Use Token for Authenticated Requests:**
```bash
curl -X GET http://localhost:4000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📊 What's Working

### ✅ Frontend Modules (Ready to Test)
- Authentication (Login/Register)
- Projects Management
- Tasks with Kanban Board
- Sprints Management
- Calendar & Events
- Meetings
- Notifications
- CRM (Contacts & Deals)
- Finance (Invoices & Expenses)
- HR (Employees & Leave Requests)
- Documents

### ✅ Backend Modules (API Endpoints)
- All 23 modules with REST APIs
- JWT Authentication
- Role-based Access Control
- Multi-tenant Organization Support

---

## 🐛 Troubleshooting

### Backend won't start
```bash
cd server-nest
rm -rf node_modules package-lock.json
npm install
npm run start:dev
```

### Frontend won't start
```bash
cd frontend
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

### Can't login
1. Make sure backend is running on port 4000
2. Check `.env.local` in frontend has correct API URL
3. Try registering a new account
4. Check browser console for errors

### CORS errors
Backend has CORS enabled by default. If you still see errors:
- Check that backend is running
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Clear browser cache

---

## 📝 Notes

- Database: SQLite (auto-created as `techos.db` in server-nest directory)
- First registered user becomes organization admin
- All data is scoped to organizations
- JWT tokens expire in 7 days (configurable in backend `.env`)

---

## 🎯 Next Steps

1. Start both servers
2. Register your demo account
3. Explore the dashboard
4. Create test data (projects, tasks, etc.)
5. Test the integration between frontend and backend

Enjoy testing TechOS! 🚀
