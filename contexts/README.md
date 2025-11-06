# Global State Management with Context API

This project uses React Context API for global state management.

## Available Contexts

### 1. AuthContext (`@/contexts`)

Manages authentication state across the application.

**Available Methods:**
- `user` - Current user object (username, email, role)
- `isAuthenticated` - Boolean indicating if user is logged in
- `isAdmin` - Boolean indicating if user has admin role
- `loading` - Boolean indicating auth check is in progress
- `login(userData)` - Set user data after successful login
- `logout()` - Clear user data and redirect to login
- `checkAuth()` - Manually check authentication state

**Usage Example:**
```tsx
import { useAuth } from '@/contexts';

function MyComponent() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      {isAdmin && <p>You have admin privileges</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. AppContext (`@/contexts`)

Manages application-wide state like notifications and UI preferences.

**Available Methods:**
- `notifications` - Array of current notifications
- `addNotification(type, message)` - Add a new notification (auto-dismisses after 5s)
- `removeNotification(id)` - Manually remove a notification
- `clearNotifications()` - Clear all notifications
- `selectedTask` - Currently selected task
- `setSelectedTask(task)` - Set the selected task
- `theme` - Current theme ('light' or 'dark')
- `toggleTheme()` - Toggle between light and dark theme

**Notification Types:**
- `'success'` - Green notification
- `'error'` - Red notification
- `'info'` - Blue notification
- `'warning'` - Yellow notification

**Usage Example:**
```tsx
import { useApp } from '@/contexts';

function TaskActions() {
  const { addNotification, setSelectedTask } = useApp();
  
  const handleSave = async () => {
    try {
      await saveTask();
      addNotification('success', 'Task saved successfully!');
    } catch (error) {
      addNotification('error', 'Failed to save task');
    }
  };
  
  return <button onClick={handleSave}>Save Task</button>;
}
```

## Setup

The contexts are already set up in the root layout (`app/layout.tsx`):

```tsx
import { GlobalProvider } from '@/contexts';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}
```

## Components

### NotificationManager

Automatically displays notifications from the AppContext. Already included in the root layout.

### AuthDebugger

Development tool to display current authentication state. Shows:
- Current user info
- Authentication status
- Token presence
- Auto-refreshes every second

## Best Practices

1. **Use `useAuth` for authentication logic** - Don't directly access localStorage for auth data
2. **Use `addNotification` instead of `alert()`** - Provides better UX with styled notifications
3. **Check `loading` state** - Always check if auth is loading before making auth decisions
4. **Centralize state** - Use contexts for data that needs to be accessed across multiple components

## Migration from useAuth Hook

The old `useAuth` hook has been replaced with the Context API. Update imports:

```tsx
// Old
import { useAuth } from '@/hooks/useAuth';

// New
import { useAuth } from '@/contexts';
```

The API remains mostly the same, but `login` now only accepts user data (the API call should be done separately).
