"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie, getCookie } from "@/libs/cookies";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/component/ui/card";
import { Input } from "@/component/ui/input";
import { Button } from "@/component/ui/button";
import { Label } from "@/component/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    const user = getCookie("user");
    if (user) {
      router.replace("/");
    } else {
      setCheckingLogin(false);
    }
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setCookie("user", JSON.stringify(data), 7);

        setTimeout(() => {
          router.replace("/");
        }, 0);
      } else {
        alert("Login failed: " + data.message);
      }
    } catch {
      alert("Error logging in");
    } finally {
      setLoading(false);
    }
  };

  if (checkingLogin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-500">Checking login status...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-800/10">
      <h1 className=" top-5 left-4 text-gray-500">
        Note: you can use demo credentials - username :{" "}
        <span className="text-violet-500">emilys </span>password :
        <span className="text-violet-500">emilyspass</span>
      </h1>
      <Card className="w-full max-w-md p-5 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-black mb-1.5">
            Welcome to Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="username" className="text-gray-800">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="bg-white/30 border-white/40 text-black placeholder-gray-500 focus:ring-violet-400"
          />

          <Label htmlFor="password" className="text-gray-800">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="bg-white/30 border-white/40 text-black placeholder-gray-500 focus:ring-violet-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-700 hover:text-black"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <Button
            className="w-full bg-violet-500 hover:bg-violet-600 text-white"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
