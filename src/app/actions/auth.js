"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTH_COOKIE_NAME = "picklecart_admin_session";
// In a real app, use environment variables and hashing.
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "picklecart";

export async function loginAdmin(username, password) {
  if (username && username.trim().toLowerCase() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // Set an HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: AUTH_COOKIE_NAME,
      value: "authenticated",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  }
  return { success: false, error: "Invalid credentials" };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/admin/login");
}

export async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get(AUTH_COOKIE_NAME);
  return session?.value === "authenticated";
}
