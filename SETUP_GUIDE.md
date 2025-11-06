# Task Manager Frontend - Complete Setup Guide

## ✅ Project Status: READY

Your Next.js frontend is fully configured and ready to connect to your Spring Boot backend!

## 📦 What Has Been Created

### Project Structure

```
taskmanager/
├── 📁 app/                          # Next.js App Router pages
│   ├── 📁 admin/
│   │   └── 📁 users/
│   │       └── page.tsx             # User management (ADMIN only)
│   ├── 📁 login/
│   │   └── page.tsx                 # Login page
│   ├── 📁 tasks/
│   │   ├── 📁 [id]/
│   │   │   ├── 📁 edit/
│   │   │   │   └── page.tsx         # Edit task
│   │   │   └── page.tsx             # View task details
│   │   ├── 📁 new/
│   │   │   └── page.tsx             # Create new task
│   │   └── page.tsx                 # Task list with filters
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout with Navbar
│   └── page.tsx                     # Home (redirects to /tasks)
│
├── 📁 components/                   # Reusable components
│   ├── Navbar.tsx                   # Navigation bar
│   └── ProtectedRoute.tsx           # Route protection HOC
│
├── 📁 hooks/                        # Custom React hooks
│   └── useAuth.ts                   # Authentication hook
│
├── 📁 lib/                          # API clients & utilities
│   ├── api.ts                       # Axios with interceptors
│   ├── auth.ts                      # Auth functions
│   ├── tasks.ts                     # Task API calls
│   └── users.ts                     # User API calls
│
├── 📁 types/                        # TypeScript types
│   └── index.ts                     # All type definitions
│
├── 📄 next.config.ts                # API proxy configuration
├── 📄 package.json                  # Dependencies (Axios included)
├── 📄 README.md                     # Full documentation
├── 📄 QUICK_REFERENCE.md           # Quick reference guide
└── 📄 .env.local.example           # Environment variables example
```

## 🚀 Getting Started (3 Steps)

### Step 1: Verify Backend is Running

Ensure your Spring Boot backend is running on `http://localhost:8080`

Test with:

```powershell
curl http://localhost:8080/api/auth/login
```

You should get a response (even if it's an error - it means the server is up).

### Step 2: Start the Frontend

```powershell
cd c:\Users\pabod\IdeaProjects\task-manager-frontend\taskmanager
npm run dev
```

### Step 3: Open Browser

Navigate to: `http://localhost:3000`

You'll be redirected to `/login` if not authenticated.

## 🔐 Default Test Flow

1. **Login** at `/login`
   - Use credentials created in your Spring Boot backend
   - Example: `admin@example.com` / `admin123`

2. **View Tasks** at `/tasks`
   - See all tasks with filters and pagination
   - Try filtering by status, priority
   - Try different sort orders

3. **Create Task** at `/tasks/new`
   - Fill in all fields
   - Assign to a user (optional)
   - Click "Create Task"

4. **View Task Details** at `/tasks/{id}`
   - Click "View" on any task
   - See full task information
   - Edit or delete from here

5. **User Management** (Admin only) at `/admin/users`
   - Only visible if logged in as ADMIN
   - Create, edit, delete users

## 🎯 Key Features Implemented

### ✅ Authentication

- [x] Login page with form validation
- [x] JWT token storage (localStorage)
- [x] Automatic token refresh on 401
- [x] Protected routes (redirect to login if not authenticated)
- [x] Role-based access control (USER vs ADMIN)
- [x] Logout functionality
- [x] Session persistence

### ✅ Task Management

- [x] List all tasks with pagination (10, 20, 50 per page)
- [x] Filter by status (TODO, IN_PROGRESS, DONE)
- [x] Filter by priority (LOW, MEDIUM, HIGH)
- [x] Sort by due date, priority, title
- [x] Create new task with all fields
- [x] Edit existing task
- [x] Delete task with confirmation
- [x] View task details
- [x] Assign task to user
- [x] Color-coded priority and status badges

### ✅ User Management (Admin)

- [x] List all users in table format
- [x] Create new user (username, email, password, role)
- [x] Edit user details
- [x] Delete user with confirmation
- [x] Pagination for user list
- [x] Modal for create/edit forms

### ✅ UI/UX

- [x] Responsive design (mobile & desktop)
- [x] Loading states (spinners)
- [x] Error messages (user-friendly)
- [x] Success feedback
- [x] Confirmation dialogs for destructive actions
- [x] Modern Tailwind CSS styling
- [x] Clean navigation with Navbar
- [x] User info display in Navbar
- [x] Role badge display

## 🔧 Configuration

### API Proxy (Already Configured)

`next.config.ts` includes:

```typescript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8080/api/:path*',
    },
  ];
}
```

This means:

- Frontend calls: `/api/tasks`
- Actually hits: `http://localhost:8080/api/tasks`
- No CORS issues!

### Token Management

Tokens are stored in `localStorage`:

- `accessToken` - Used for API authentication
- `refreshToken` - Used to get new access token
- `user` - Current user info (username, email, role)

Interceptor automatically:

1. Adds `Authorization: Bearer {token}` to all requests
2. On 401 response, tries to refresh token
3. Retries original request with new token
4. If refresh fails, redirects to login

## 📊 API Endpoints Used

### Auth Endpoints

| Method | Endpoint          | Description                 |
| ------ | ----------------- | --------------------------- |
| POST   | /api/auth/login   | Login with email/password   |
| POST   | /api/auth/refresh | Refresh access token        |
| POST   | /api/auth/logout  | Logout and invalidate token |

### Task Endpoints

| Method | Endpoint               | Description                  |
| ------ | ---------------------- | ---------------------------- |
| GET    | /api/tasks             | Get all tasks (with filters) |
| GET    | /api/tasks/{id}        | Get single task              |
| POST   | /api/tasks             | Create new task              |
| PUT    | /api/tasks/{id}        | Update task                  |
| DELETE | /api/tasks/{id}        | Delete task                  |
| POST   | /api/tasks/{id}/assign | Assign task to user          |

### User Endpoints (Admin Only)

| Method | Endpoint        | Description               |
| ------ | --------------- | ------------------------- |
| GET    | /api/users      | Get all users (paginated) |
| GET    | /api/users/{id} | Get single user           |
| POST   | /api/users      | Create new user           |
| PUT    | /api/users/{id} | Update user               |
| DELETE | /api/users/{id} | Delete user               |

## 🐛 Troubleshooting

### Problem: Can't connect to backend

**Symptoms**: Network errors, "Failed to fetch"  
**Solution**:

1. Check backend is running: `curl http://localhost:8080/api/auth/login`
2. Check backend CORS allows `http://localhost:3000`
3. Restart both frontend and backend

### Problem: Token expired immediately

**Symptoms**: Constant redirects to login  
**Solution**: Check backend JWT token expiration settings

### Problem: 403 Forbidden on certain pages

**Symptoms**: Can't access admin pages  
**Solution**: Ensure logged-in user has ADMIN role

### Problem: Changes not reflecting

**Symptoms**: Old code still running  
**Solution**:

```powershell
# Stop dev server (Ctrl+C)
# Clear Next.js cache
rm -r .next
# Restart
npm run dev
```

### Problem: TypeScript errors

**Symptoms**: Red squiggly lines, build fails  
**Solution**:

```powershell
npm run lint
```

Check error messages and fix type mismatches

## 📚 Documentation Files

1. **README.md** - Full project documentation
2. **QUICK_REFERENCE.md** - Quick reference for common operations
3. **SETUP_GUIDE.md** - This file (complete setup guide)
4. **.env.local.example** - Environment variables template

## 🎨 Customization

### Change Color Scheme

Edit Tailwind classes in components. Current primary color is `blue-600`.

Replace `blue-600` with:

- `red-600`, `green-600`, `purple-600`, etc.

### Add New Feature

1. Add types to `types/index.ts`
2. Add API functions to `lib/`
3. Create page in `app/`
4. Wrap with `<ProtectedRoute>` if needed

### Modify Backend URL

Change `destination` in `next.config.ts`:

```typescript
destination: "http://your-backend-url.com/api/:path*";
```

## ✨ Production Deployment

### Build for Production

```powershell
npm run build
```

### Test Production Build Locally

```powershell
npm start
```

### Deploy to Vercel

```powershell
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables for Production

Set in Vercel dashboard or `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

## 📈 Next Steps

1. **Test Everything**
   - Login with different roles
   - Create, edit, delete tasks
   - Test filters and pagination
   - Test admin user management

2. **Customize**
   - Update branding (colors, logo)
   - Add more features (comments, attachments)
   - Improve UI/UX based on feedback

3. **Deploy**
   - Deploy backend to cloud (Heroku, AWS, etc.)
   - Deploy frontend to Vercel/Netlify
   - Update API URL in environment variables

## 🎉 You're All Set!

Your Next.js frontend is production-ready and fully integrated with your Spring Boot backend!

**Start the app**:

```powershell
npm run dev
```

**Open**: http://localhost:3000

**Enjoy!** 🚀

---

**Questions?** Check README.md or QUICK_REFERENCE.md for detailed information.
