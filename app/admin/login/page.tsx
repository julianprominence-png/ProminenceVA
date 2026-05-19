"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch {
      setError("Invalid credentials. Access denied.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020104] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(126,34,206,0.25)_0%,transparent_60%)] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.15)_0%,transparent_60%)] rounded-full blur-[120px]" />
      </div>

      {/* Noise texture */}
      <div
        className="fixed inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-20 w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-3 h-3 rounded-full bg-fuchsia-500/60 animate-ping" />
              <div className="relative w-2 h-2 rounded-full bg-fuchsia-200" />
            </div>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/80">
              Prominence
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-medium text-white mb-3">
            Admin Access
          </h1>
          <p className="text-white/40 text-xs tracking-[0.15em] uppercase">
            Authorized personnel only
          </p>
        </div>

        {/* Login card */}
        <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.04] to-[#020104]/80 backdrop-blur-[80px] border border-white/10 border-b-black/80 border-r-black/50 rounded-3xl p-8 md:p-10">
          {/* Card ambient glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="block text-[9px] font-bold tracking-[0.25em] uppercase text-white/50 mb-3">
                Transmission Vector
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                required
                className="w-full bg-[#010002]/80 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-500/60 focus:bg-white/[0.04] transition-all"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold tracking-[0.25em] uppercase text-white/50 mb-3">
                Access Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#010002]/80 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-500/60 focus:bg-white/[0.04] transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3 text-red-300 text-xs font-medium tracking-wide animate-[pulse_2s_ease-in-out]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-b from-white to-gray-300 text-black font-bold rounded-full px-8 py-4 text-[10px] uppercase tracking-widest active:translate-y-1 hover:from-white hover:to-gray-100 transition-all ${
                loading ? "opacity-60 cursor-wait" : ""
              }`}
            >
              {loading ? "Authenticating..." : "Initiate Access"}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-white/30 text-[9px] font-bold tracking-[0.3em] uppercase hover:text-white/60 transition-colors"
          >
            ← Return to Main Interface
          </a>
        </div>
      </div>
    </div>
  );
}
