"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, HelpCircle, Mail, Lock, User } from "lucide-react";
import Image from 'next/image';

// Social login icons as SVG components
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        switch (data.user.role) {
          case "admin": router.push("/admin"); break;
          case "sub-admin": router.push("/sub-admin"); break;
          case "user": router.push("/user"); break;
          default: router.push("/user");
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Placeholder for social login
    alert(`${provider} login coming soon!`);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#F6F9FE', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Top bar */}
      <div className="login-topbar" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '32px 48px 0 48px', maxWidth: 1200, margin: '0 auto' }}>
        <span style={{ fontWeight: 600, fontSize: 32, color: '#2563eb', letterSpacing: 1 }}>esure</span>
        <a href="#" style={{ color: '#2563eb', fontWeight: 500, fontSize: 16, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}><svg width="20" height="20" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2l-2-3-2 3H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4"/><circle cx="12" cy="13" r="2"/></svg>Need help?</a>
          </div>
      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%' }}>
        {/* Background clouds/waves */}
        <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: 0 }} viewBox="0 0 1600 800" fill="none"><ellipse cx="300" cy="200" rx="80" ry="30" fill="#fff" opacity=".7"/><ellipse cx="600" cy="120" rx="60" ry="20" fill="#fff" opacity=".7"/><ellipse cx="1200" cy="180" rx="90" ry="35" fill="#fff" opacity=".7"/><path d="M0 600 Q800 400 1600 600 V800 H0 Z" fill="#fff" opacity=".7"/></svg>
        {/* Responsive container */}
        <div className="login-main-row" style={{ zIndex: 1, width: '100%', maxWidth: 1100, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
          {/* Login card */}
          <div className="login-card" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: '48px 24px 36px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', width: '94vw', maxWidth: 400, margin: '0 auto' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, transform: 'translate(-50%, -50%)', background: '#fff', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={36} color="#2563eb" />
            </div>
            <h2 style={{ fontWeight: 600, fontSize: 24, marginTop: 32, marginBottom: 18, textAlign: 'center', color: '#111' }}>Log in to your account</h2>
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }} autoComplete="off">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="email" style={{ fontWeight: 500, fontSize: 15, color: '#222', marginBottom: 2 }}>Email address</label>
                <input id="email" name="email" type="email" placeholder="e.g. johndoe@email.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ border: '1px solid #b9c4c9', borderRadius: 8, padding: '12px 14px', fontSize: 16, outline: 'none', background: '#fff', color: '#222', fontWeight: 400, transition: 'border .2s', width: '100%' }} />
            </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="password" style={{ fontWeight: 500, fontSize: 15, color: '#222', marginBottom: 2 }}>Password</label>
                <input id="password" name="password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required style={{ border: '1px solid #b9c4c9', borderRadius: 8, padding: '12px 14px', fontSize: 16, outline: 'none', background: '#fff', color: '#222', fontWeight: 400, transition: 'border .2s', width: '100%' }} />
              </div>
              {error && <div style={{ color: '#d32f2f', background: '#fff0f0', border: '1px solid #f8d7da', borderRadius: 8, padding: 8, textAlign: 'center', fontSize: 15 }}>{error}</div>}
              <button type="submit" disabled={isLoading} style={{ width: '100%', borderRadius: 24, textAlign: 'center', padding: '15px 0', marginTop: 8, backgroundColor: '#FF9100', color: '#fff', fontSize: 18, fontWeight: 600, border: 'none', boxShadow: '0 2px 6px -1px rgba(0,0,0,.13)', transition: 'all .3s ease', outline: 0, cursor: isLoading ? 'not-allowed' : 'pointer' }}>{isLoading ? 'Signing in...' : 'Next'}</button>
          </form>
          </div>
          {/* Car illustration: always below card on mobile, centered, never peeking out */}
          <div className="car-illustration" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: 220, minWidth: 120, margin: '0 auto' }}>
            <svg width="100%" height="auto" viewBox="0 0 220 140" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="80" width="160" height="40" rx="20" fill="#2563eb"/><ellipse cx="60" cy="120" rx="18" ry="12" fill="#222" opacity=".2"/><ellipse cx="160" cy="120" rx="18" ry="12" fill="#222" opacity=".2"/><rect x="50" y="60" width="120" height="40" rx="20" fill="#2563eb"/><rect x="70" y="40" width="80" height="30" rx="15" fill="#6fa1ff"/><circle cx="70" cy="110" r="10" fill="#fff"/><circle cx="150" cy="110" r="10" fill="#fff"/><rect x="90" y="50" width="40" height="20" rx="8" fill="#fff"/><circle cx="110" cy="65" r="5" fill="#2563eb"/><circle cx="130" cy="65" r="5" fill="#2563eb"/></svg>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="login-footer" style={{ width: '100%', background: '#fff', borderTop: '1px solid #f0f0f0', padding: '14px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, fontSize: 13, color: '#2563eb', fontWeight: 500 }}>
        <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Privacy</a>
        <span style={{ color: '#b9c4c9' }}>|</span>
        <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Legal</a>
        <span style={{ color: '#b9c4c9' }}>|</span>
        <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Accessibility</a>
        <span style={{ color: '#b9c4c9' }}>|</span>
        <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Cookie notice</a>
        <span style={{ color: '#b9c4c9' }}>|</span>
        <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>Driving abroad</a>
      </footer>
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .login-main-row { flex-direction: column !important; gap: 0 !important; align-items: center !important; }
          .login-card { margin-bottom: 24px !important; }
          .car-illustration { margin-top: 16px !important; max-width: 180px !important; }
        }
        @media (max-width: 700px) {
          .login-main-row { flex-direction: column !important; gap: 0 !important; align-items: center !important; }
          .login-card { width: 98vw !important; min-width: 0 !important; max-width: 400px !important; margin: 8vw auto 0 auto !important; padding: 24px 4vw 18px 4vw !important; border-radius: 12px !important; }
          .car-illustration { display: flex !important; margin: 18px auto 0 auto !important; max-width: 120px !important; }
          .login-topbar { padding: 12px 4vw 0 4vw !important; font-size: 20px !important; }
          .login-footer { padding: 8px 0 !important; font-size: 11px !important; gap: 6px !important; }
        }
      `}</style>
    </div>
  );
}
