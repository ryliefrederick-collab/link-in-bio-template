"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Incorrect password.");
      setLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50"
      style={{ fontFamily: '"Neue Montreal", sans-serif' }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1
            className="mb-1 text-2xl font-bold text-gray-900"
            style={{ fontFamily: '"The Seasons", serif' }}
          >
            LinkBio
          </h1>
          <p className="text-sm text-gray-500">Sign in to your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              placeholder="Enter password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
