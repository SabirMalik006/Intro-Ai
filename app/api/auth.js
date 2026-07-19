const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const BACKEND_URL = API_URL.replace('/api/v1', '');

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  if (data.data?.user) {
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }

  return data;
}

export async function logoutUser() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  localStorage.removeItem('user');

  return response.json();
}

export async function getCurrentUser() {
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch user');
  }

  return data;
}

export function getStoredUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function isLoggedIn() {
  return !!getStoredUser();
}

export function getGoogleAuthUrl() {
  return `${BACKEND_URL}/api/v1/auth/google`;
}

export function loginWithGoogle() {
  window.location.href = getGoogleAuthUrl();
}

export async function forgotPassword(email) {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to send OTP');
  }

  return data;
}

export async function verifyOtp(email, otp) {
  const response = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'OTP verification failed');
  }

  return data;
}

export async function resetPassword(email, resetToken, newPassword) {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, resetToken, newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Password reset failed');
  }

  return data;
}
