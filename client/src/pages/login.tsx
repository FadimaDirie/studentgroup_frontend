import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { Lock } from "lucide-react";

const roles = ["student", "teacher", "admin"];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(roles[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  async function handleLogin(e: React.FormEvent) {

    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://mernstack-backend-vtfj.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        // Save token and user info to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setLocation("/");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground transition-colors duration-500">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-card/90 dark:bg-card/90 backdrop-blur-md text-card-foreground">
        <CardHeader className="flex flex-col items-center gap-2">
          <span className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-3 mb-2 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </span>
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <p className="text-muted-foreground text-center text-sm">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 bg-input text-foreground focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            {/* Optionally show role selection if needed for UI, but not sent to API */}
            {/* <div>
              <Label htmlFor="role">Role</Label>
              <select id="role" className="w-full border rounded-md p-2" value={role} onChange={e => setRole(e.target.value)}>
                {roles.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div> */}
            {error && <div className="text-destructive text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full mt-2" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button>
            <div className="text-sm text-center mt-4">
              Don&apos;t have an account? <a href="/register" className="text-primary underline">Register</a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 