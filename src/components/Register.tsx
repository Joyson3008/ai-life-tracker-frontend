import { useState } from "react";

type Props = {
  onRegisterSuccess: () => void;
  goToLogin: () => void;
};

function Register({ onRegisterSuccess, goToLogin }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [strength, setStrength] = useState(0);

  const checkStrength = (val: string) => {
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setStrength(s);
  };

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#f43f5e", "#f97316", "#eab308", "#22c55e"][strength];

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("⚠️ All fields required");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("https://ai-life-tracker.onrender.com/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const text = await res.text();
      if (!res.ok) { alert("❌ " + text); return; }
      alert("✅ Registered successfully!");
      onRegisterSuccess();
    } catch {
      alert("❌ Error registering");
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
          background: radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, rgba(99,60,220,0.08) 40%, transparent 70%);
          pointer-events: none;
        }

        .auth-root::after {
          content: '';
          position: absolute;
          width: 600px; height: 600px;
          bottom: -200px; left: -100px;
          background: radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 70%);
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
        .orb-1 { width: 280px; height: 280px; top: 8%; right: 6%; background: rgba(56,189,248,0.1); animation-delay: 0s; }
        .orb-2 { width: 220px; height: 220px; bottom: 10%; left: 5%; background: rgba(99,60,220,0.12); animation-delay: -4s; }
        .orb-3 { width: 160px; height: 160px; top: 55%; right: 12%; background: rgba(244,63,94,0.07); animation-delay: -2s; }

        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        .auth-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          margin: 24px;
          padding: 44px 44px;
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
          margin-bottom: 32px;
          animation: cardReveal 0.6s 0.1s cubic-bezier(0.16,1,0.3,1) both;
        }

        .logo-img {
          width: 80px;
          height: 80px;
          object-fit: contain;
          filter: drop-shadow(0 0 20px rgba(138,80,255,0.5)) drop-shadow(0 0 40px rgba(56,189,248,0.25));
          animation: logoPulse 4s ease-in-out infinite;
        }

        @keyframes logoPulse {
          0%, 100% { filter: drop-shadow(0 0 18px rgba(138,80,255,0.45)) drop-shadow(0 0 36px rgba(56,189,248,0.2)); }
          50% { filter: drop-shadow(0 0 28px rgba(138,80,255,0.65)) drop-shadow(0 0 56px rgba(56,189,248,0.35)); }
        }

        .logo-title {
          margin-top: 12px;
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #67e8f9 0%, #818cf8 50%, #c4b5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .logo-sub {
          margin-top: 4px;
          font-size: 11.5px;
          color: rgba(255,255,255,0.28);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .form-heading {
          text-align: center;
          margin-bottom: 26px;
          animation: cardReveal 0.6s 0.15s cubic-bezier(0.16,1,0.3,1) both;
        }

        .form-heading h2 {
          font-size: 25px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.02em;
          margin-bottom: 5px;
        }

        .form-heading p {
          font-size: 13px;
          color: rgba(255,255,255,0.33);
          font-weight: 400;
        }

        .field-wrap {
          margin-bottom: 14px;
        }

        .field-wrap:nth-child(1) { animation: cardReveal 0.6s 0.18s cubic-bezier(0.16,1,0.3,1) both; }
        .field-wrap:nth-child(2) { animation: cardReveal 0.6s 0.22s cubic-bezier(0.16,1,0.3,1) both; }
        .field-wrap:nth-child(3) { animation: cardReveal 0.6s 0.26s cubic-bezier(0.16,1,0.3,1) both; }

        .field-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.38);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 7px;
        }

        .field-inner {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.22);
          pointer-events: none;
          transition: color 0.2s;
        }

        .field-inner.focused .field-icon {
          color: #67e8f9;
        }

        .auth-input {
          width: 100%;
          padding: 13px 16px 13px 44px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.08);
          color: white;
          font-size: 14px;
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .auth-input::placeholder { color: rgba(255,255,255,0.18); }

        .auth-input:focus {
          border-color: rgba(103,232,249,0.5);
          background: rgba(103,232,249,0.05);
          box-shadow: 0 0 0 4px rgba(103,232,249,0.08);
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
          font-size: 15px;
          line-height: 1;
        }
        .eye-btn:hover { color: rgba(255,255,255,0.6); }

        .strength-bar-wrap {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .strength-bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }

        .strength-bar {
          flex: 1;
          height: 3px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          transition: background 0.3s ease;
        }

        .strength-label {
          font-size: 11px;
          font-weight: 600;
          min-width: 36px;
          text-align: right;
          transition: color 0.3s;
        }

        .submit-btn {
          width: 100%;
          margin-top: 20px;
          padding: 15px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          letter-spacing: 0.02em;
          color: white;
          background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%);
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.25s ease;
          box-shadow: 0 8px 28px rgba(14,165,233,0.35), 0 0 0 1px rgba(255,255,255,0.08) inset;
          animation: cardReveal 0.6s 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(14,165,233,0.45), 0 0 0 1px rgba(255,255,255,0.1) inset;
        }

        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

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

        .perks-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 22px 0 0;
          padding: 18px;
          border-radius: 16px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          animation: cardReveal 0.6s 0.35s cubic-bezier(0.16,1,0.3,1) both;
        }

        .perk {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12.5px;
          color: rgba(255,255,255,0.4);
        }

        .perk-icon {
          width: 26px; height: 26px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0 16px;
          animation: cardReveal 0.6s 0.38s cubic-bezier(0.16,1,0.3,1) both;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }

        .divider-text {
          font-size: 11px;
          color: rgba(255,255,255,0.22);
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
          animation: cardReveal 0.6s 0.4s cubic-bezier(0.16,1,0.3,1) both;
        }

        .toggle-link span {
          color: #67e8f9;
          font-weight: 600;
          transition: color 0.2s;
        }

        .toggle-link:hover { color: rgba(255,255,255,0.55); }
        .toggle-link:hover span { color: #a5f3fc; }

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
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="logo-title">AI Life Tracker</div>
            <div className="logo-sub">Your intelligent daily companion</div>
          </div>

          {/* Heading */}
          <div className="form-heading">
            <h2>Start your journey 🚀</h2>
            <p>Create your account — it takes 30 seconds</p>
          </div>

          {/* Name */}
          <div className="field-wrap">
            <label className="field-label">Full name</label>
            <div className={`field-inner ${focused === 'name' ? 'focused' : ''}`}>
              <span className="field-icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused('name')}
                onBlur={() => setFocused(null)}
                className="auth-input"
              />
            </div>
          </div>

          {/* Email */}
          <div className="field-wrap">
            <label className="field-label">Email address</label>
            <div className={`field-inner ${focused === 'email' ? 'focused' : ''}`}>
              <span className="field-icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                className="auth-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="field-wrap" style={{ marginBottom: password ? 6 : 14 }}>
            <label className="field-label">Password</label>
            <div className={`field-inner ${focused === 'password' ? 'focused' : ''}`}>
              <span className="field-icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => { setPassword(e.target.value); checkStrength(e.target.value); }}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                className="auth-input"
                style={{ paddingRight: '44px' }}
              />
              <button className="eye-btn" onClick={() => setShowPassword(!showPassword)} type="button">
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Strength meter */}
          {password && (
            <div className="strength-bar-wrap" style={{ marginBottom: 14 }}>
              <div className="strength-bars">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="strength-bar"
                    style={{ background: i <= strength ? strengthColor : undefined }}
                  />
                ))}
              </div>
              <span className="strength-label" style={{ color: strengthColor }}>
                {strengthLabel}
              </span>
            </div>
          )}

          {/* Submit */}
          <button className="submit-btn" onClick={handleRegister} disabled={loading}>
            <span className="btn-shimmer" />
            {loading ? (
              <><span className="spinner" />Creating account…</>
            ) : (
              <>🌟 Create Account</>
            )}
          </button>

          {/* Perks */}
          <div className="perks-row">
            {[
              { icon: "🤖", color: "rgba(99,102,241,0.2)", text: "AI-powered daily insights & scoring" },
              { icon: "📊", color: "rgba(34,197,94,0.15)", text: "Track habits, expenses & wellness" },
              { icon: "🔒", color: "rgba(56,189,248,0.15)", text: "Your data stays private & secure" },
            ].map((p, i) => (
              <div className="perk" key={i}>
                <div className="perk-icon" style={{ background: p.color }}>{p.icon}</div>
                {p.text}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">Already a member?</span>
            <div className="divider-line" />
          </div>

          {/* Toggle */}
          <div className="toggle-link" onClick={goToLogin}>
            Already have an account?{" "}
            <span>Sign in →</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
