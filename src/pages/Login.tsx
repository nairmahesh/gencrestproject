/**
 * File: src/pages/Login.tsx
 * Created by Vinod, vinodkotagiri@icloud.com
 *
 * Purpose:
 * Login page for all roles (MDO, SO, TSM, HO, ADMIN).
 * Uses backend /api/auth/login and stores JWT tokens in localStorage.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import type { User } from "../types";
import { LoginUser } from "../services/axios";

interface LoginResponse {
 accessToken: string;
 refreshToken: string;
 user: User;
}

export default function Login() {
 const navigate = useNavigate();
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
   const data = await LoginUser({ email, password })
   if (!data) {
    setError("Login failed");
    return
   }
   localStorage.setItem("accessToken", data!.accessToken);
   localStorage.setItem("refreshToken", data!.refreshToken);
   localStorage.setItem("user", JSON.stringify(data!.user));
   navigate("/dashboard");
  } catch (err: any) {
   setError(err.response?.data?.error || "Login failed");
  } finally {
   setLoading(false);
  }
 }

 return (
  <div className="flex items-center justify-center h-screen bg-gray-100">
   <form
    onSubmit={handleLogin}
    className="bg-white shadow-lg rounded-lg p-8 w-96"
   >
    <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
     Gencrest Login
    </h1>

    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

    <div className="mb-4">
     <label className="block text-sm font-medium mb-1">Email</label>
     <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full border rounded px-3 py-2"
      required
     />
    </div>

    <div className="mb-6">
     <label className="block text-sm font-medium mb-1">Password</label>
     <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full border rounded px-3 py-2"
      required
     />
    </div>

    <button
     type="submit"
     disabled={loading}
     className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
     {loading ? "Logging in..." : "Login"}
    </button>
   </form>
  </div>
 );
}
