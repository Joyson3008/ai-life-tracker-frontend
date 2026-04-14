import { useState } from "react";

type Props = {
  setUserId: (id: number) => void;
  goToRegister: () => void;
};

function Login({ setUserId, goToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

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
          headers: { "Content-Type": "application/json" },
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
    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        .auth-root {
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #05070f;
          position: relative;
          overflow: hidden;
        }

        .auth-root::before {
          content: '';
          position: absolute;
          width: 900px; height: 900px;
          top: -300px; left: 50%;
          transform: translateX(-50%);
          background: radial-gradient(ellipse, rgba(99,60,220,0.18) 0%, rgba(138,80,255,0.08) 40%, transparent 70%);
          pointer-events: none;
        }

        .auth-root::after {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          bottom: -200px; right: -100px;
          background: radial-gradient(ellipse, rgba(56,189,248,0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          animation: orbFloat 8s ease-in-out infinite;
        }
        .orb-1 { width: 300px; height: 300px; top: 10%; left: 5%; background: rgba(99,60,220,0.12); animation-delay: 0s; }
        .orb-2 { width: 200px; height: 200px; bottom: 15%; right: 8%; background: rgba(56,189,248,0.1); animation-delay: -3s; }
        .orb-3 { width: 150px; height: 150px; top: 60%; left: 15%; background: rgba(168,85,247,0.08); animation-delay: -5s; }

        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        .auth-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          margin: 24px;
          padding: 48px 44px;
          border-radius: 28px;
          background: linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.09);
          backdrop-filter: blur(24px);
          box-shadow:
            0 32px 80px rgba(0,0,0,0.5),
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 1px 0 rgba(255,255,255,0.08) inset;
          animation: cardReveal 0.6s cubic-bezier(0.16,1,0.3,1) both;
        }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .logo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 36px;
          animation: cardReveal 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both;
        }

        .logo-img {
          width: 88px;
          height: 88px;
          object-fit: contain;
          filter: drop-shadow(0 0 24px rgba(138,80,255,0.5)) drop-shadow(0 0 48px rgba(99,60,220,0.3));
          animation: logoPulse 4s ease-in-out infinite;
        }

        @keyframes logoPulse {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(138,80,255,0.45)) drop-shadow(0 0 40px rgba(99,60,220,0.25)); }
          50% { filter: drop-shadow(0 0 32px rgba(138,80,255,0.7)) drop-shadow(0 0 64px rgba(99,60,220,0.4)); }
        }

        .logo-title {
          margin-top: 14px;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #c4b5fd 0%, #818cf8 40%, #67e8f9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .logo-sub {
          margin-top: 4px;
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .form-heading {
          text-align: center;
          margin-bottom: 28px;
          animation: cardReveal 0.6s 0.15s cubic-bezier(0.16,1,0.3,1) both;
        }

        .form-heading h2 {
          font-size: 26px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }

        .form-heading p {
          font-size: 13.5px;
          color: rgba(255,255,255,0.35);
          font-weight: 400;
        }

        .field-wrap {
          margin-bottom: 16px;
          animation: cardReveal 0.6s 0.2s cubic-bezier(0.16,1,0.3,1) both;
        }

        .field-label {
          display: block;
          font-size: 11.5px;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .field-inner {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.25);
          pointer-events: none;
          transition: color 0.2s;
        }

        .field-inner.focused .field-icon {
          color: #a78bfa;
        }

        .auth-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.08);
          color: white;
          font-size: 14.5px;
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .auth-input::placeholder { color: rgba(255,255,255,0.2); }

        .auth-input:focus {
          border-color: rgba(167,139,250,0.6);
          background: rgba(167,139,250,0.07);
          box-shadow: 0 0 0 4px rgba(167,139,250,0.1);
        }

        .eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.25);
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s;
          font-size: 16px;
          line-height: 1;
        }
        .eye-btn:hover { color: rgba(255,255,255,0.6); }

        .submit-btn {
          width: 100%;
          margin-top: 8px;
          padding: 15px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.02em;
          color: white;
          background: linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #38bdf8 100%);
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.25s ease;
          box-shadow: 0 8px 28px rgba(99,102,241,0.4), 0 0 0 1px rgba(255,255,255,0.08) inset;
          animation: cardReveal 0.6s 0.25s cubic-bezier(0.16,1,0.3,1) both;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(99,102,241,0.55), 0 0 0 1px rgba(255,255,255,0.1) inset;
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .btn-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
          transform: translateX(-100%);
          animation: shimmer 2.5s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0 20px;
          animation: cardReveal 0.6s 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .divider-text {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .toggle-link {
          text-align: center;
          font-size: 13.5px;
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          transition: color 0.2s;
          animation: cardReveal 0.6s 0.35s cubic-bezier(0.16,1,0.3,1) both;
        }

        .toggle-link span {
          color: #a78bfa;
          font-weight: 600;
          transition: color 0.2s;
        }

        .toggle-link:hover { color: rgba(255,255,255,0.55); }
        .toggle-link:hover span { color: #c4b5fd; }

        .badge-row {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 28px;
          animation: cardReveal 0.6s 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          font-size: 10.5px;
          color: rgba(255,255,255,0.3);
          font-weight: 500;
        }

        .badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
        }

        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="auth-root">
        <div className="grid-bg" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="auth-card">
          {/* Logo */}
          <div className="logo-wrap">
            <img
              src="/1776168907036_image.png"
              alt="AI Life Tracker"
              className="logo-img"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="logo-title">AI Life Tracker</div>
            <div className="logo-sub">Your intelligent daily companion</div>
          </div>

          {/* Heading */}
          <div className="form-heading">
            <h2>Welcome back 👋</h2>
            <p>Sign in to continue your journey</p>
          </div>

          {/* Email */}
          <div className="field-wrap">
            <label className="field-label">Email address</label>
            <div
              className={`field-inner ${focused === "email" ? "focused" : ""}`}
            >
              <span className="field-icon">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="auth-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="field-wrap" style={{ marginBottom: 24 }}>
            <label className="field-label">Password</label>
            <div
              className={`field-inner ${focused === "password" ? "focused" : ""}`}
            >
              <span className="field-icon">
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="auth-input"
                style={{ paddingRight: "44px" }}
              />
              <button
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            className="submit-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            <span className="btn-shimmer" />
            {loading ? (
              <>
                <span className="spinner" />
                Signing in…
              </>
            ) : (
              <>✨ Sign In</>
            )}
          </button>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">New here?</span>
            <div className="divider-line" />
          </div>

          {/* Toggle */}
          <div className="toggle-link" onClick={goToRegister}>
            Don't have an account? <span>Create one →</span>
          </div>

          {/* Trust badges */}
          <div className="badge-row">
            <div className="badge">
              <div className="badge-dot" style={{ background: "#34d399" }} />
              Secure
            </div>
            <div className="badge">
              <div className="badge-dot" style={{ background: "#818cf8" }} />
              AI-Powered
            </div>
            <div className="badge">
              <div className="badge-dot" style={{ background: "#f472b6" }} />
              Private
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
