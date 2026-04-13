import { useState } from "react";

type Props = {
  setUserId: (id: number) => void;
};

function Login({ setUserId }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("⚠️ Email and password required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://ai-life-tracker.onrender.com/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password.trim(),
          }),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        alert("❌ Login failed: " + text);
        return;
      }

      const data = await res.json();

      setUserId(data.id);
      localStorage.setItem("userId", data.id);

      alert("✅ Login successful!");
    } catch (error) {
      console.error("Login error:", error);
      alert("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] px-6">
      {/* 🔥 MAIN CONTAINER */}
      <div className="w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* ================= LEFT PANEL ================= */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-10 flex-col justify-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            🚀 AI Life Tracker
          </h1>

          <p className="text-indigo-100 text-lg leading-relaxed">
            Track your habits, analyze your day, and grow with AI-powered
            insights.
          </p>

          {/* FEATURES */}
          <div className="mt-10 space-y-4 text-indigo-200 text-sm">
            <p>📊 Smart productivity tracking</p>
            <p>🧠 AI-powered daily insights</p>
            <p>📈 Personal growth analytics</p>
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="flex flex-1 items-center justify-center p-10 bg-[#0B0F19]">
          <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome Back 👋
            </h2>

            <p className="text-gray-400 mb-6 text-sm">
              Login to continue your journey
            </p>

            {/* EMAIL */}
            <div className="mb-4">
              <label className="text-xs text-gray-400">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl bg-[#111827] text-white placeholder-gray-500 outline-none border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-6">
              <label className="text-xs text-gray-400">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl bg-[#111827] text-white placeholder-gray-500 outline-none border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition-all duration-300 shadow-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* FOOTER */}
            <p className="text-gray-500 text-xs text-center mt-6">
              Built with ❤️ for self-improvement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
