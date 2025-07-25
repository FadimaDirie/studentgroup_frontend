import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { UserPlus } from "lucide-react";

const roles = ["student", "teacher", "admin"];

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState(roles[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!fullName || !email || !password || !confirm) {
      setError("Please fill all fields");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://mernstack-backend-vtfj.onrender.com/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, password, role })
      });
      const data = await res.json();
      console.log('Register response:', data); // DEBUG
      if (!res.ok) {
        setError(data.message || "Registration failed");
      } else {
        // Always redirect to dashboard after registration
        if (data.token && data.user) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        setLocation("/"); // dashboard
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors duration-500">
      <div className="w-full max-w-lg bg-card/90 dark:bg-card/90 rounded-2xl shadow-2xl p-8 text-card-foreground">
        <CardHeader className="flex flex-col items-center gap-2">
          <span className="bg-gradient-to-br from-pink-500 to-blue-500 rounded-full p-3 mb-2 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </span>
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <p className="text-muted-foreground text-center text-sm">Sign up to get started</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required className="mt-1 focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground" />
            </div>
            <div>
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input id="confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required className="mt-1 focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground" />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select id="role" className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground" value={role} onChange={e => setRole(e.target.value)}>
                {roles.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            {error && <div className="text-destructive text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full mt-2" disabled={loading}>{loading ? "Registering..." : "Register"}</Button>
            <div className="text-sm text-center mt-4">
              Already have an account? <a href="/login" className="text-primary underline">Login</a>
            </div>
          </form>
        </CardContent>
      </div>
    </div>
  );
} 