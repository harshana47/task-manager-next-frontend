# Task Manager Frontend - Quick Reference

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📁 Key Files Reference

### Configuration

- `next.config.ts` - Next.js configuration, API proxy setup
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

### Core Libraries

- `lib/api.ts` - Axios instance with auth interceptors
- `lib/auth.ts` - Authentication functions (login, logout, token management)
- `lib/tasks.ts` - Task API calls
- `lib/users.ts` - User API calls (admin only)

### Hooks

- `hooks/useAuth.ts` - Authentication state and functions

### Components

- `components/ProtectedRoute.tsx` - Route protection HOC
- `components/Navbar.tsx` - Navigation component

### Types

- `types/index.ts` - All TypeScript interfaces and types

## 🔐 Authentication

### Login

```typescript
const { login } = useAuth();
await login({ email: "user@example.com", password: "password" });
```

### Logout

```typescript
const { logout } = useAuth();
await logout();
```

### Check Auth Status

```typescript
const { isAuthenticated, isAdmin, user } = useAuth();
```

### Protect a Page

```typescript
// For any authenticated user
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>

// For admin only
<ProtectedRoute requireAdmin>
  <YourComponent />
</ProtectedRoute>
```

## 📝 Task Operations

### Get Tasks with Filters

```typescript
import { taskApi } from "@/lib/tasks";

const response = await taskApi.getTasks({
  page: 0,
  size: 10,
  sort: "dueDate,asc",
  status: "TODO",
  priority: "HIGH",
  dueBefore: "2025-12-31",
  dueAfter: "2025-01-01",
});
```

### Get Single Task

```typescript
const task = await taskApi.getTask(taskId);
```

### Create Task

```typescript
const newTask = await taskApi.createTask({
  title: "Task Title",
  description: "Task Description",
  priority: "MEDIUM",
  status: "TODO",
  dueDate: "2025-12-31",
  assignedUser: userObject, // optional
});
```

### Update Task

```typescript
const updatedTask = await taskApi.updateTask(taskId, {
  title: "Updated Title",
  status: "IN_PROGRESS",
});
```

### Delete Task

```typescript
await taskApi.deleteTask(taskId);
```

### Assign Task

```typescript
const task = await taskApi.assignTask(taskId, userId);
```

## 👥 User Operations (Admin Only)

### Get Users

```typescript
import { userApi } from "@/lib/users";

const response = await userApi.getUsers(page, size);
```

### Create User

```typescript
const newUser = await userApi.createUser({
  username: "johndoe",
  email: "john@example.com",
  password: "securepassword",
  role: "USER",
});
```

### Update User

```typescript
const updatedUser = await userApi.updateUser(userId, {
  username: "newusername",
  role: "ADMIN",
});
```

### Delete User

```typescript
await userApi.deleteUser(userId);
```

## 🎨 Styling Guide

### Color Scheme

- **Primary**: Blue (blue-600)
- **Success**: Green
- **Warning**: Yellow
- **Error**: Red
- **Info**: Gray

### Priority Colors

```typescript
// In your component
const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-800";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800";
    case "LOW":
      return "bg-green-100 text-green-800";
  }
};
```

### Status Colors

```typescript
const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "TODO":
      return "bg-gray-100 text-gray-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "DONE":
      return "bg-green-100 text-green-800";
  }
};
```

## 🛠️ Adding New Features

### 1. Add New API Endpoint

```typescript
// In lib/tasks.ts or create new file
export const taskApi = {
  async newEndpoint(params): Promise<ResponseType> {
    const response = await api.get<ResponseType>("/endpoint", { params });
    return response.data;
  },
};
```

### 2. Add New Page

```typescript
// Create app/new-page/page.tsx
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function NewPage() {
  return (
    <ProtectedRoute>
      <div>Your content here</div>
    </ProtectedRoute>
  );
}
```

### 3. Add New Type

```typescript
// In types/index.ts
export interface NewType {
  id: number;
  name: string;
  // ... other fields
}
```

## 🐛 Common Issues & Solutions

### 1. Backend Not Running

**Error**: Network errors, API calls fail  
**Solution**: Ensure Spring Boot backend is running on `http://localhost:8080`

### 2. CORS Issues

**Error**: CORS policy errors  
**Solution**: Backend should have CORS configured for `http://localhost:3000`

### 3. Token Expired

**Error**: Automatic redirect to login  
**Solution**: This is expected behavior. The interceptor tries to refresh, if that fails, user must login again

### 4. 403 Forbidden

**Error**: Access denied  
**Solution**: Check user role. Some endpoints require ADMIN role

### 5. Build Errors

**Error**: TypeScript compilation errors  
**Solution**: Run `npm run lint` to see all errors. Fix type mismatches

## 📊 Project Statistics

- **Total Components**: 7
- **Total Pages**: 7
- **Total API Functions**: ~15
- **Total Types**: 8
- **Lines of Code**: ~2000+

## 🔗 Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 📞 Backend Endpoints Summary

| Method | Endpoint               | Description   | Auth | Role       |
| ------ | ---------------------- | ------------- | ---- | ---------- |
| POST   | /api/auth/login        | Login         | ❌   | -          |
| POST   | /api/auth/refresh      | Refresh token | ❌   | -          |
| POST   | /api/auth/logout       | Logout        | ✅   | -          |
| GET    | /api/tasks             | Get all tasks | ✅   | USER/ADMIN |
| GET    | /api/tasks/{id}        | Get task      | ✅   | USER/ADMIN |
| POST   | /api/tasks             | Create task   | ✅   | USER/ADMIN |
| PUT    | /api/tasks/{id}        | Update task   | ✅   | USER/ADMIN |
| DELETE | /api/tasks/{id}        | Delete task   | ✅   | USER/ADMIN |
| POST   | /api/tasks/{id}/assign | Assign task   | ✅   | USER/ADMIN |
| GET    | /api/users             | Get all users | ✅   | ADMIN      |
| GET    | /api/users/{id}        | Get user      | ✅   | ADMIN      |
| POST   | /api/users             | Create user   | ✅   | ADMIN      |
| PUT    | /api/users/{id}        | Update user   | ✅   | ADMIN      |
| DELETE | /api/users/{id}        | Delete user   | ✅   | ADMIN      |

---

**Need help?** Check the main README.md or review the code comments in each file.
