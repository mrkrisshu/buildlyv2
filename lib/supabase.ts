/**
 * Local Storage Auth System
 * Completely free, open source, works on Vercel
 * No external database needed!
 */

export interface User {
  id: string;
  email: string;
  password: string; // hashed
  name?: string;
  gemini_api_key?: string;
}

// Simple in-memory storage (can be replaced with file system or KV store on Vercel)
const USERS_KEY = 'buildly_users';
const CURRENT_USER_KEY = 'buildly_current_user';

// Helper to get all users from localStorage
function getUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

// Helper to save users to localStorage
function saveUsers(users: User[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Helper to hash password (simple hash for demo - use bcrypt in production)
function hashPassword(password: string): string {
  // Simple hash for demo purposes
  return btoa(password);
}

// Helper to verify password
function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash;
}

// Sign up new user
export async function signUp(email: string, password: string, name?: string): Promise<User | null> {
  const users = getUsers();
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    email,
    password: hashPassword(password),
    name,
  };
  
  users.push(newUser);
  saveUsers(users);
  
  // Set as current user
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  }
  
  return newUser;
}

// Sign in existing user
export async function signIn(email: string, password: string): Promise<User | null> {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user || !verifyPassword(password, user.password)) {
    throw new Error('Invalid credentials');
  }
  
  // Set as current user
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
  
  return user;
}

// Sign out
export async function signOut() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

// Helper to get current user
export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(CURRENT_USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

// Helper to get user's Gemini API key
export async function getUserGeminiKey(userId: string): Promise<string | null> {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  return user?.gemini_api_key || null;
}

// Helper to save user's Gemini API key
export async function saveUserGeminiKey(userId: string, apiKey: string): Promise<boolean> {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return false;
  
  users[userIndex].gemini_api_key = apiKey;
  saveUsers(users);
  
  // Update current user in storage too
  const currentUser = await getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    currentUser.gemini_api_key = apiKey;
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    }
  }
  
  return true;
}
