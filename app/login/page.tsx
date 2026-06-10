"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { Lock, User } from "lucide-react";

const API_URL = "https://10.186.47.226:6001/api/users/authenticate";
const API_KEY = "admin_k7Xp9Qm2L:s8V3tN9xR2mY5wP7qL4kH1jF6bD8cA0eG3";

export default function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": API_KEY,
        },
        body: JSON.stringify({
          Login: username,
          Password: password,
        }),
      });

      let result: any = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (response.status === 200) {
        console.log("Authentication successful:", result);
        window.location.href = "/dashboard";
      } else {
        setError(
          result?.message ||
            `Authentication failed. Status: ${response.status}`,
        );
      }
    } catch (err) {
      console.error("Fetch request error:", err);
      setError("An error occurred while connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen login-bg flex items-center justify-center bg-cover bg-center relative">
      <div className="absolute inset-0 bg-linear-to-br from-gray/60 to-indigo-900/80"></div>
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-80 p-5 rounded-3xl 
               bg-white/10 backdrop-blur-xl 
               shadow-2xl "
      >
        <div className="flex justify-center">
          <Image src={"/login-logo.png"} width={75} height={75} alt="" />
        </div>
        <h1 className="text-sm text-gray-900/90 font-custom mt-4 text-shadow font-bold text-center mb-4">
          LynkDoor Admin Login
        </h1>

        <div className="mb-5 relative">
          <label className="block mb-2 text-xs text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            required
            placeholder="Enter your username"
            className="w-full px-10 py-2 rounded-xl text-xs
                     bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400
                     transition"
          />
          <div className="absolute inset-y-10 left-4 flex items-center pointer-events-none">
            <User className="h-4 w-4 opacity-40" />
          </div>
        </div>
        <div className="mb-6 relative">
          <label className="block mb-2 text-xs text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            placeholder="Enter your password"
            className="w-full px-10 py-2 rounded-xl text-xs
                     bg-white/20
                     focus:outline-none focus:ring-2 focus:ring-indigo-400
                     transition"
          />
          <div className="absolute inset-y-10 left-4 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 opacity-40" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full cursor-pointer text-white py-2 rounded-xl text-sm transition-all duration-300
        ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-linear-to-r from-indigo-600/60 to-indigo-700/60 hover:scale-105 hover:shadow-sm"
        }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
        )}
      </form>
    </div>
  );
}
