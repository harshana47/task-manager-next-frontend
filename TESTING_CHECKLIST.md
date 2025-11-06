# 🧪 Testing Checklist - Task Manager Frontend

Use this checklist to verify all features are working correctly.

## 🔧 Pre-Test Setup

- [ ] Spring Boot backend is running on `http://localhost:8080`
- [ ] Backend has at least one user account created
- [ ] Backend has CORS configured for `http://localhost:3000`
- [ ] Frontend dev server is running: `npm run dev`
- [ ] Browser is open at `http://localhost:3000`

---

## 🔐 Authentication Tests

### Login

- [ ] Navigate to `/login`
- [ ] Enter invalid credentials → See error message
- [ ] Enter valid USER credentials → Redirect to `/tasks`
- [ ] Enter valid ADMIN credentials → Redirect to `/tasks`
- [ ] Check localStorage has `accessToken`, `refreshToken`, `user`
- [ ] Navbar shows username and role badge
- [ ] Refresh page → Still logged in (no redirect)

### Logout

- [ ] Click "Logout" button in navbar
- [ ] Redirected to `/login`
- [ ] localStorage cleared (no tokens)
- [ ] Try to access `/tasks` → Redirected to `/login`

### Token Refresh (Advanced)

- [ ] Login successfully
- [ ] Wait for token to expire (or manually invalidate in backend)
- [ ] Make an API call (create task, load tasks)
- [ ] Should automatically refresh and continue (no redirect)
- [ ] If refresh fails, should redirect to login

---

## 📝 Task Management Tests

### View Tasks

- [ ] Navigate to `/tasks`
- [ ] See list of tasks (or "No tasks found" message)
- [ ] Each task shows: title, description, priority badge, status badge, due date
- [ ] If task has assigned user, shows username
- [ ] Action buttons visible: View, Edit, Delete

### Filter Tasks

- [ ] **Status Filter**
  - [ ] Select "All" → See all tasks
  - [ ] Select "To Do" → Only TODO tasks shown
  - [ ] Select "In Progress" → Only IN_PROGRESS tasks shown
  - [ ] Select "Done" → Only DONE tasks shown

- [ ] **Priority Filter**
  - [ ] Select "All" → See all tasks
  - [ ] Select "Low" → Only LOW priority shown
  - [ ] Select "Medium" → Only MEDIUM priority shown
  - [ ] Select "High" → Only HIGH priority shown

- [ ] **Sort**
  - [ ] "Due Date (Ascending)" → Tasks ordered by due date (earliest first)
  - [ ] "Due Date (Descending)" → Tasks ordered by due date (latest first)
  - [ ] "Priority (High to Low)" → HIGH → MEDIUM → LOW
  - [ ] "Title (A-Z)" → Alphabetical order

- [ ] **Per Page**
  - [ ] Select 5 → Shows 5 tasks per page
  - [ ] Select 10 → Shows 10 tasks per page
  - [ ] Select 20 → Shows 20 tasks per page
  - [ ] Select 50 → Shows 50 tasks per page

### Pagination

- [ ] If total pages > 1, pagination controls visible
- [ ] "Previous" button disabled on first page
- [ ] "Next" button disabled on last page
- [ ] Click "Next" → Shows next page of tasks
- [ ] Click "Previous" → Shows previous page
- [ ] Page indicator shows "Page X of Y"

### Create Task

- [ ] Click "Create Task" button → Navigate to `/tasks/new`
- [ ] Form shows all fields: title, description, priority, status, due date, assign to
- [ ] Try to submit empty form → Validation errors (required fields)
- [ ] Fill in all fields with valid data
- [ ] Select "Unassigned" or assign to a user
- [ ] Click "Create Task"
- [ ] Success → Redirect to `/tasks`
- [ ] New task appears in list
- [ ] Error → Error message displayed

### View Task Details

- [ ] Click "View" on any task → Navigate to `/tasks/{id}`
- [ ] See full task information:
  - [ ] Title
  - [ ] Priority badge
  - [ ] Status badge
  - [ ] Description
  - [ ] Due date (formatted nicely)
  - [ ] Assigned user (if any) with avatar
  - [ ] Task ID
- [ ] "Edit" button visible
- [ ] "Delete" button visible
- [ ] "Back to Tasks" link works

### Edit Task

- [ ] From task details, click "Edit" → Navigate to `/tasks/{id}/edit`
- [ ] Form pre-filled with existing task data
- [ ] Change title → Save → Title updated
- [ ] Change status → Save → Status updated
- [ ] Change priority → Save → Priority updated
- [ ] Change due date → Save → Due date updated
- [ ] Change assigned user → Save → Assigned user updated
- [ ] Click "Cancel" → Return to task details (no changes saved)
- [ ] Success → Redirect to task details
- [ ] Updated values visible

### Delete Task

- [ ] Click "Delete" button (from list or details)
- [ ] Confirmation dialog appears
- [ ] Click "Cancel" → Task not deleted
- [ ] Click "OK"/"Yes" → Task deleted
- [ ] Success → Task removed from list
- [ ] If on details page → Redirect to `/tasks`

---

## 👥 User Management Tests (ADMIN Only)

### Access Control

- [ ] Login as USER → Navbar does NOT show "Users" link
- [ ] Try to access `/admin/users` as USER → Redirect to `/tasks`
- [ ] Login as ADMIN → Navbar SHOWS "Users" link
- [ ] Access `/admin/users` as ADMIN → Page loads

### View Users

- [ ] Navigate to `/admin/users`
- [ ] See table with columns: ID, Username, Email, Role, Actions
- [ ] Each user row shows avatar (first letter of username)
- [ ] Role badge shows (ADMIN in purple, USER in green)
- [ ] "Create User" button visible at top
- [ ] Action buttons: Edit, Delete

### Create User

- [ ] Click "Create User" button → Modal appears
- [ ] Form has fields: username, email, password, role
- [ ] Try to submit empty → Validation errors
- [ ] Fill in all fields
- [ ] Select role (USER or ADMIN)
- [ ] Click "Save"
- [ ] Success → Modal closes, new user in table
- [ ] Error → Error message in modal
- [ ] Click "Cancel" → Modal closes, no user created

### Edit User

- [ ] Click "Edit" on any user → Modal appears
- [ ] Form pre-filled with user data
- [ ] Password field NOT shown (can't change password in edit)
- [ ] Change username → Save → Username updated
- [ ] Change email → Save → Email updated
- [ ] Change role → Save → Role updated
- [ ] Click "Cancel" → Modal closes, no changes

### Delete User

- [ ] Click "Delete" on any user
- [ ] Confirmation dialog appears
- [ ] Click "Cancel" → User not deleted
- [ ] Click "OK" → User deleted
- [ ] User removed from table

### Pagination (Users)

- [ ] If total pages > 1, pagination visible
- [ ] "Previous" disabled on page 1
- [ ] "Next" disabled on last page
- [ ] Navigate between pages → Works correctly

---

## 🎨 UI/UX Tests

### Responsive Design

- [ ] Resize browser to mobile width (< 640px)
- [ ] Layout adapts (columns become rows)
- [ ] All buttons and forms usable
- [ ] Text readable
- [ ] No horizontal scrolling
- [ ] Navbar collapses appropriately

### Loading States

- [ ] Login → Shows "Signing in..." on button
- [ ] Task list loading → Shows spinner and "Loading tasks..."
- [ ] Task details loading → Shows spinner and "Loading task..."
- [ ] Creating task → Shows "Creating..." on button
- [ ] Saving task → Shows "Saving..." on button
- [ ] User management loading → Shows spinner

### Error Handling

- [ ] Invalid login → Error message displayed
- [ ] Network error → User-friendly error shown
- [ ] 403 Forbidden → Appropriate message/redirect
- [ ] 404 Not Found → Handled gracefully
- [ ] Form validation errors → Clear messages

### Visual Feedback

- [ ] Priority badges color-coded (RED = High, YELLOW = Medium, GREEN = Low)
- [ ] Status badges color-coded (GRAY = Todo, BLUE = In Progress, GREEN = Done)
- [ ] Hover effects on buttons
- [ ] Focus states on form inputs
- [ ] Disabled states on buttons (when loading)
- [ ] Confirmation dialogs for destructive actions

---

## 🔄 Integration Tests

### Token Persistence

- [ ] Login → Close browser → Reopen → Still logged in
- [ ] Login → Refresh page → Still logged in
- [ ] Logout → Close browser → Reopen → Must login again

### Role-Based Access

- [ ] USER can create/edit/delete tasks
- [ ] USER cannot access `/admin/users`
- [ ] ADMIN can do everything USER can
- [ ] ADMIN can access `/admin/users`
- [ ] ADMIN can manage users

### Task Assignment

- [ ] Create task with assigned user → User shown in details
- [ ] Create task without assigned user → "Unassigned"
- [ ] Edit task to assign user → User updated
- [ ] Edit task to unassign → No user shown

---

## 🚀 Performance Tests

### Load Time

- [ ] Initial page load < 3 seconds
- [ ] Task list loads < 2 seconds
- [ ] Navigation between pages feels instant
- [ ] No unnecessary re-renders

### Network

- [ ] Open browser DevTools → Network tab
- [ ] Login → Check API call to `/api/auth/login`
- [ ] Load tasks → Check API call to `/api/tasks`
- [ ] Verify Authorization header present on protected endpoints
- [ ] No excessive API calls (check for infinite loops)

---

## 🐛 Bug Verification

### Common Issues to Check

- [ ] No console errors in browser DevTools
- [ ] No TypeScript errors in VS Code
- [ ] No React warnings in console
- [ ] All images/assets load correctly
- [ ] Date formatting works correctly
- [ ] Pagination math correct (page numbers, totals)
- [ ] Sort order correct for all options
- [ ] Filter combinations work together

---

## ✅ Test Results Summary

Date Tested: ******\_\_\_\_******

Tester: ********\_\_\_\_********

| Category        | Pass | Fail | Notes |
| --------------- | ---- | ---- | ----- |
| Authentication  | ☐    | ☐    |       |
| Task Management | ☐    | ☐    |       |
| User Management | ☐    | ☐    |       |
| UI/UX           | ☐    | ☐    |       |
| Integration     | ☐    | ☐    |       |
| Performance     | ☐    | ☐    |       |

---

## 📝 Issues Found

List any bugs or issues discovered during testing:

1. ***
2. ***
3. ***
4. ***
5. ***

---

## 🎉 Testing Complete!

If all tests pass, your application is ready for deployment! 🚀

**Next Steps**:

1. Fix any issues found
2. Re-test failed scenarios
3. Deploy to staging environment
4. Repeat testing in staging
5. Deploy to production

---

**Testing Tips**:

- Test with multiple user accounts (different roles)
- Test edge cases (empty lists, single item, many items)
- Test error scenarios (network errors, invalid data)
- Test on different browsers (Chrome, Firefox, Safari, Edge)
- Test on different devices (desktop, tablet, mobile)
