# Task Manager Frontend

A modern, production-ready Next.js frontend for the Spring Boot Task Management API.

## 🚀 Features

### Authentication & Security

- ✅ JWT-based authentication with access & refresh tokens
- ✅ Automatic token refresh on 401 responses
- ✅ Protected routes with role-based access control
- ✅ Secure token storage in localStorage
- ✅ Session persistence across page reloads

### Task Management

- ✅ View all tasks with pagination, sorting, and filtering
- ✅ Filter by status (TODO, IN_PROGRESS, DONE)
- ✅ Filter by priority (LOW, MEDIUM, HIGH)
- ✅ Sort by due date, priority, or title
- ✅ Create, edit, and delete tasks
- ✅ Assign tasks to users
- ✅ Task detail view with full information

### User Management (Admin Only)

- ✅ View all users in paginated table
- ✅ Create new users with username, email, password, and role
- ✅ Edit existing users
- ✅ Delete users
- ✅ Role-based UI (ADMIN vs USER)

### UI/UX

- ✅ Clean, modern interface with Tailwind CSS
- ✅ Responsive design for mobile and desktop
- ✅ Loading states and error handling
- ✅ Color-coded status and priority badges
- ✅ Intuitive navigation with navbar
- ✅ Confirmation dialogs for destructive actions

## 📁 Project Structure

```
taskmanager/
├── app/
│   ├── admin/users/page.tsx      # User management (admin only)
│   ├── login/page.tsx            # Login page
│   ├── tasks/
│   │   ├── [id]/page.tsx         # Task detail page
│   │   ├── [id]/edit/page.tsx    # Edit task page
│   │   ├── new/page.tsx          # Create task page
│   │   └── page.tsx              # Task list page
│   ├── layout.tsx                # Root layout with navbar
│   └── page.tsx                  # Home (redirects to /tasks)
├── components/
│   ├── Navbar.tsx                # Navigation bar
│   └── ProtectedRoute.tsx        # Route protection wrapper
├── hooks/
│   └── useAuth.ts                # Authentication hook
├── lib/
│   ├── api.ts                    # Axios instance with interceptors
│   ├── auth.ts                   # Auth API functions
│   ├── tasks.ts                  # Task API functions
│   └── users.ts                  # User API functions
├── types/
│   └── index.ts                  # TypeScript type definitions
└── next.config.ts                # Next.js config with API proxy
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **Authentication**: JWT with refresh tokens

## 📦 Installation

```bash
npm install
```

## 🚀 Getting Started

1. **Ensure your Spring Boot backend is running on `http://localhost:8080`**

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000)**

4. **Login with your credentials** (created via backend)

## 🔧 Configuration

### API Proxy

The `next.config.ts` proxies all `/api/*` requests to the Spring Boot backend:

```typescript
async rewrites() {
  return [
    { source: '/api/:path*', destination: 'http://localhost:8080/api/:path*' }
  ];
}
```

### Environment Variables (Optional)

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=/api
```

## 🔐 Authentication Flow

1. Login with email/password → Backend returns access & refresh tokens
2. Tokens stored in localStorage
3. Access token sent with every request (Authorization header)
4. On 401, interceptor auto-refreshes token and retries request
5. If refresh fails → redirect to login

## 👥 User Roles

- **USER**: View/create/edit/delete tasks
- **ADMIN**: All USER permissions + user management

## 📄 API Endpoints

### Auth

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Tasks

- `GET /api/tasks` (with filters)
- `GET /api/tasks/{id}`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`
- `POST /api/tasks/{id}/assign`

### Users (Admin Only)

- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

## 🎨 Pages

- **/login** - Login form
- **/tasks** - Task list with filters, sorting, pagination
- **/tasks/[id]** - Task details
- **/tasks/new** - Create task
- **/tasks/[id]/edit** - Edit task
- **/admin/users** - User management (admin only)

## 🚧 Build for Production

```bash
npm run build
npm start
```

---

**Built with ❤️ using Next.js 16, TypeScript, and Tailwind CSS**
