import { LoginFormData, RegisterFormData } from "../schemas/auth.schema";

export async function loginWithGoogle(credential: string) {
  const res = await fetch(`/api/auth/login/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ token: credential }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? "Login gagal");
  }

  return res.json();
}

export async function loginWithEmail(data: LoginFormData) {
  const res = await fetch(`/api/auth/login/email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message ?? "Login gagal");
  }

  return res.json();
}

export async function registerAccount(data: RegisterFormData) {
  const res = await fetch(`/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message ?? "Registrasi gagal");
  }

  return res.json();
}

export async function logout() {
  const res = await fetch(`/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message ?? "Logout gagal");
  }

  return res.json();
}
