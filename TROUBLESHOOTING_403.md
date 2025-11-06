# 🔧 Troubleshooting 403 Error

## Problem

You're getting a **403 Forbidden** error when trying to access `/api/tasks`.

## Root Cause

The `/api/tasks` endpoint requires authentication, but no access token is being sent with the request.

## Solutions

### Solution 1: Login First (Most Common)

1. **Navigate to the login page**: http://localhost:3000/login

2. **Login with valid credentials** from your Spring Boot backend

3. **After successful login**, you'll be redirected to `/tasks` and it should work

### Solution 2: Check if Backend is Running

```powershell
# Test if backend is accessible
curl http://localhost:9090/api/auth/login

# Should return something (even an error), not connection refused
```

### Solution 3: Check Backend CORS Configuration

Your Spring Boot backend needs CORS configured for `http://localhost:3000`.

**Required Spring Boot Configuration:**

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### Solution 4: Check Backend Security Configuration

Your Spring Boot Security config should allow `/api/auth/login` without authentication:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for API
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // Allow login without auth
                .requestMatchers("/api/**").authenticated()   // Require auth for other endpoints
            )
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            );

        return http.build();
    }
}
```

### Solution 5: Check if Token is Present

**Open Browser DevTools**:

1. Press F12
2. Go to "Application" tab
3. Look at "Local Storage" → "http://localhost:3000"
4. Check if you see:
   - `accessToken`
   - `refreshToken`
   - `user`

**If NOT present**: You need to login first

**If present but still getting 403**: Token might be invalid or expired

### Solution 6: Clear Cache and Login Again

```javascript
// Open browser console (F12) and run:
localStorage.clear();
// Then go to /login and login again
```

### Solution 7: Check Network Tab

1. Open DevTools (F12)
2. Go to "Network" tab
3. Try to load tasks
4. Click on the failed `/tasks` request
5. Check "Headers" tab:
   - Does it have `Authorization: Bearer xxx`?
   - If NO: Not logged in
   - If YES: Check "Response" tab for error details

## Quick Test Script

Run this in your browser console (F12):

```javascript
// Check if tokens exist
console.log("Access Token:", localStorage.getItem("accessToken"));
console.log("Refresh Token:", localStorage.getItem("refreshToken"));
console.log("User:", localStorage.getItem("user"));

// If tokens exist, try to fetch tasks
if (localStorage.getItem("accessToken")) {
  fetch("/api/tasks", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  })
    .then((r) => r.json())
    .then((data) => console.log("Tasks:", data))
    .catch((err) => console.error("Error:", err));
}
```

## Common Scenarios

### Scenario A: First Time Setup

**Problem**: Never logged in  
**Solution**: Go to http://localhost:3000/login and login

### Scenario B: Token Expired

**Problem**: Logged in before, but token expired  
**Solution**:

- Go to /login
- Or the app should auto-refresh the token

### Scenario C: Backend Not Running

**Problem**: Backend is down or on wrong port  
**Solution**:

- Start Spring Boot backend
- Verify it's on port 9090 (as per your config)
- Test: `curl http://localhost:9090/api/auth/login`

### Scenario D: CSRF Protection

**Problem**: Spring Security CSRF is enabled  
**Solution**: Disable CSRF for API endpoints (see Solution 4)

### Scenario E: Wrong Backend Port

**Problem**: Backend is on 8080, but config says 9090  
**Solution**: Update `next.config.ts` to match your backend port

## Testing Checklist

- [ ] Backend is running on port 9090
- [ ] Backend `/api/auth/login` endpoint is accessible without auth
- [ ] Backend CORS allows `http://localhost:3000`
- [ ] Backend CSRF is disabled for API
- [ ] You've logged in via the frontend login page
- [ ] localStorage has `accessToken`, `refreshToken`, `user`
- [ ] Network requests include `Authorization` header

## Still Not Working?

### Enable Debug Logging

Add this to your `lib/api.ts`:

```typescript
// Add this after creating the axios instance
api.interceptors.request.use(
  (config) => {
    console.log("🚀 Request:", config.method?.toUpperCase(), config.url);
    console.log("📦 Headers:", config.headers);
    const token = getAccessToken();
    if (token && config.headers) {
      console.log("🔑 Token:", token.substring(0, 20) + "...");
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("⚠️ No token found!");
    }
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);
```

This will log all requests and show if the token is being sent.

## Contact Points

If still stuck, check:

1. **Browser Console** (F12) - Check for JavaScript errors
2. **Network Tab** - Check request/response details
3. **Backend Logs** - Check Spring Boot logs for errors
4. **Backend API** - Test with Postman/curl first

---

## Quick Fix (Most Likely)

**Just go to http://localhost:3000/login and login!** 🔐

The protected route should redirect you automatically, but if not, navigate manually.
