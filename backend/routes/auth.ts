import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const authRoutes = new Hono();

// In-memory user storage (replace with database in production)
interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  avatar_url?: string;
  role: 'client' | 'provider';
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

const users: User[] = [];
let userIdCounter = 1;

// JWT secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["client", "provider"])
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

// Simple password hashing (use bcrypt in production)
function hashPassword(password: string): string {
  return Buffer.from(password).toString('base64');
}

function verifyPassword(password: string, hash: string): boolean {
  return Buffer.from(password).toString('base64') === hash;
}

// Register endpoint
authRoutes.post("/register", zValidator("json", registerSchema), async (c) => {
  try {
    console.log('Register endpoint called');
    const { name, email, password, role } = c.req.valid("json");
    console.log('Registration data:', { name, email, role });
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      console.log('User already exists:', email);
      return c.json({ error: "User with this email already exists" }, 400);
    }
    
    // Create new user
    const newUser: User = {
      id: userIdCounter.toString(),
      name,
      email,
      password_hash: hashPassword(password),
      avatar_url: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`,
      role,
      email_verified: true, // Auto-verify for demo
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    users.push(newUser);
    userIdCounter++;
    console.log('User created:', newUser.id, newUser.email);
    
    // Generate JWT token
    const token = await sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET);
    
    // Set HTTP-only cookie
    setCookie(c, "auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
    
    // Return user data (without password)
    const { password_hash, ...userResponse } = newUser;
    console.log('Registration successful for:', userResponse.email);
    return c.json({ user: userResponse });
    
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ error: "Registration failed", details: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
});

// Login endpoint
authRoutes.post("/login", zValidator("json", loginSchema), async (c) => {
  try {
    const { email, password } = c.req.valid("json");
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return c.json({ error: "Invalid email or password" }, 401);
    }
    
    // Verify password
    if (!verifyPassword(password, user.password_hash)) {
      return c.json({ error: "Invalid email or password" }, 401);
    }
    
    // Generate JWT token
    const token = await sign({ userId: user.id, email: user.email }, JWT_SECRET);
    
    // Set HTTP-only cookie
    setCookie(c, "auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });
    
    // Return user data (without password)
    const { password_hash, ...userResponse } = user;
    return c.json({ user: userResponse });
    
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Login failed" }, 500);
  }
});

// Get current user endpoint
authRoutes.get("/me", async (c) => {
  try {
    const token = getCookie(c, "auth-token");
    if (!token) {
      return c.json({ error: "Not authenticated" }, 401);
    }
    
    // Verify JWT token
    const payload = await verify(token, JWT_SECRET) as { userId: string; email: string };
    
    // Find user
    const user = users.find(u => u.id === payload.userId);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    
    // Return user data (without password)
    const { password_hash, ...userResponse } = user;
    return c.json({ user: userResponse });
    
  } catch (error) {
    console.error("Get user error:", error);
    return c.json({ error: "Authentication failed" }, 401);
  }
});

// Logout endpoint
authRoutes.post("/logout", (c) => {
  deleteCookie(c, "auth-token");
  return c.json({ message: "Logged out successfully" });
});

// Verify email endpoint (placeholder)
authRoutes.post("/verify-email", zValidator("json", z.object({ token: z.string() })), (c) => {
  return c.json({ message: "Email verified successfully" });
});

// Request password reset endpoint (placeholder)
authRoutes.post("/request-reset", zValidator("json", z.object({ email: z.string().email() })), (c) => {
  return c.json({ message: "Password reset email sent" });
});

// Reset password endpoint (placeholder)
authRoutes.post("/reset-password", zValidator("json", z.object({ 
  token: z.string(), 
  password: z.string().min(6) 
})), (c) => {
  return c.json({ message: "Password reset successfully" });
});

export { authRoutes };