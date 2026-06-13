// Frontend auth calling Django Backend API

const STORAGE_KEY = "rosyta_auth_user";
const TOKEN_KEY = "rosyta_access_token";
export const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api`;
const API_URL = `${API_BASE_URL}/auth`;

export type MockUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: "admin" | "client";
  name?: string;
  auto_logout?: boolean;
};

export function getStoredUser(): MockUser | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || !token) return null;
    return JSON.parse(raw) as MockUser;
  } catch {
    return null;
  }
}

export function getAuthHeaders() {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loginUser(email: string, password: string): Promise<any> {
  const res = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Échec de la connexion");
  }

  const data = await res.json();
  
  if (data.requires_2fa) {
    return data; // { requires_2fa: true, user_id: number, email: string, message: string }
  }

  const user = {
    ...data.user,
    name: `${data.user.first_name} ${data.user.last_name}`.trim() || data.user.email.split("@")[0]
  };

  localStorage.setItem(TOKEN_KEY, data.access);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  
  return user;
}

export async function verify2FA(userId: number, otp: string): Promise<MockUser> {
  const res = await fetch(`${API_URL}/verify-2fa/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, otp }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Code invalide");
  }

  const data = await res.json();
  
  const user = {
    ...data.user,
    name: `${data.user.first_name} ${data.user.last_name}`.trim() || data.user.email.split("@")[0]
  };

  localStorage.setItem(TOKEN_KEY, data.access);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  
  return user;
}

export async function registerUser(data: Record<string, string>): Promise<MockUser> {
  const res = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Échec de l'inscription");
  }

  const resData = await res.json();
  return resData.user;
}

export async function resetPassword(email: string): Promise<void> {
  const res = await fetch(`${API_URL}/password-reset/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Erreur de réinitialisation");
  }
}

export async function resetPasswordConfirm(uid: string, token: string, newPassword: string): Promise<void> {
  const res = await fetch(`${API_URL}/password-reset-confirm/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, token, new_password: newPassword }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Erreur lors de la réinitialisation du mot de passe");
  }
}

export function logoutUser(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TOKEN_KEY);
}
