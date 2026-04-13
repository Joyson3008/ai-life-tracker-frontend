import { useState } from "react";

type Props = {
  onRegisterSuccess: () => void;
};

function Register({ onRegisterSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const res = await fetch(
        "https://ai-life-tracker.onrender.com/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
          }),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        setError(text);
        return;
      }

      const data = await res.json();

      console.log("Registered:", data);

      alert("✅ Registered successfully!");

      // 🔥 IMPORTANT FIX → SWITCH TO LOGIN
      onRegisterSuccess();

      // reset form
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 PASSWORD STRENGTH
  const getStrength = () => {
    if (password.length < 4) return "Weak";
    if (password.length < 8) return "Medium";
    return "Strong";
  };

  return (
    <div className="w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-2xl border border-white/10">
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-12 flex-col justify-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Build Your Better Self 🚀
        </h1>

        <p className="text-indigo-100 text-lg leading-relaxed">
          Start tracking your habits, emotions, and productivity with powerful
          AI insights.
        </p>

        <div className="mt-10 space-y-4 text-indigo-200">
          <p>📊 Understand your daily patterns</p>
          <p>🧠 Get AI-powered life insights</p>
          <p>📈 Improve consistency & focus</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 items-center justify-center bg-[#0B0F19] p-6">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 animate-[fadeIn_0.6s_ease]">
          <h2 className="text-2xl font-bold text-white mb-2">
            Create Account ✨
          </h2>

          <p className="text-gray-400 mb-6 text-sm">
            Start your journey with AI Life Tracker
          </p>

          {/* ERROR */}
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          {/* NAME */}
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 p-3 rounded-xl bg-[#111827] text-white border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-3 rounded-xl bg-[#111827] text-white border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-2 p-3 rounded-xl bg-[#111827] text-white border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* PASSWORD STRENGTH */}
          {password && (
            <p
              className={`text-xs mb-4 ${
                getStrength() === "Strong"
                  ? "text-green-400"
                  : getStrength() === "Medium"
                    ? "text-yellow-400"
                    : "text-red-400"
              }`}
            >
              Strength: {getStrength()}
            </p>
          )}

          {/* BUTTON */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-lg"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>
      </div>

      {/* ANIMATION */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}

export default Register;
