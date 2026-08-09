import { useState } from "react";
import type { FormEvent } from "react";
import { useTheme } from "../context/ThemeContext";
import appLogo from "../assets/ikigai-logo.png";

type Props = { onRegisterSuccess: () => void; goToLogin: () => void };
type IconName = "person" | "mail" | "lock" | "eye" | "eyeOff" | "sun" | "moon";

function Icon({ name }: { name: IconName }) {
  const paths = {
    person: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c.5-3.2 3-5 7-5s6.5 1.8 7 5" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    eye: (
      <>
        <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    eyeOff: (
      <>
        <path d="m3 3 18 18" />
        <path d="M10.6 6.2A10.8 10.8 0 0 1 12 6c6.1 0 9.5 6 9.5 6a17.5 17.5 0 0 1-3.1 3.8M6.1 6.1A17.3 17.3 0 0 0 2.5 12S5.9 18 12 18c1.3 0 2.4-.3 3.4-.7" />
        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    moon: (
      <path d="M20.5 14.4A8.5 8.5 0 0 1 9.6 3.5 8.5 8.5 0 1 0 20.5 14.4Z" />
    ),
  };
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

export default function Register({ onRegisterSuccess, goToLogin }: Props) {
  const { darkMode, toggleDarkMode } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#e75b52", "#ef8b2c", "#3e88ee", "#24a148"][
    strength
  ];

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError("Enter your name, email address, and password to continue.");
      return;
    }
    if (password.length < 8) {
      setError("Choose a password with at least 8 characters.");
      return;
    }
    try {
      setError("");
      setLoading(true);
      const response = await fetch(
        "https://ai-life-tracker.onrender.com/api/users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        },
      );
      const message = await response.text();
      if (!response.ok) {
        setError(
          message || "We couldn't create your account. Please try again.",
        );
        return;
      }
      onRegisterSuccess();
    } catch (requestError) {
      console.error("Registration error:", requestError);
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`samsung-register ${darkMode ? "samsung-dark" : "samsung-light"}`}
    >
      <style>{`
        .samsung-register { --bg:#f6f7fb;--surface:#fff;--field:#edf1f8;--text:#18191d;--muted:#6f727b;--blue:#2378e3;--blue-soft:#dceaff;--line:#dbe0e9;--error:#bc2f28;min-height:100svh;background:var(--bg);color:var(--text);font-family:Roboto,"Segoe UI",Arial,sans-serif; }.samsung-dark { --bg:#101114;--surface:#1d1e22;--field:#292b31;--text:#f3f4f7;--muted:#b1b4bd;--blue:#8ab4ff;--blue-soft:#293a56;--line:#34363d;--error:#ffb4ab; }
        .samsung-shell { width:min(100%,480px);min-height:100svh;margin:0 auto;display:flex;flex-direction:column;box-sizing:border-box;padding:max(16px,env(safe-area-inset-top)) 20px 0; }.samsung-topbar { min-height:48px;display:flex;justify-content:flex-end; }.theme-button,.password-button { width:48px;height:48px;padding:0;border:0;border-radius:50%;display:grid;place-items:center;color:var(--blue);background:transparent;cursor:pointer; }.theme-button svg,.password-button svg,.field-icon svg { width:21px;height:21px; }.theme-button:hover,.password-button:hover { background:var(--blue-soft); }
        .view-area { padding:22px 8px 34px; }.identity { display:flex;align-items:center;gap:16px;margin-bottom:34px;font-size:30px;font-weight:750;letter-spacing:-.045em; }.identity img { width:118px;height:118px;object-fit:cover;flex:0 0 118px; }.view-area h1 { max-width:350px;margin:0;font-size:clamp(34px,9vw,42px);line-height:1.06;letter-spacing:-.05em;font-weight:750; }.view-area p { max-width:340px;margin:14px 0 0;color:var(--muted);font-size:17px;line-height:1.45; }
        .interaction-area { margin:0 -20px;padding:28px 20px max(30px,env(safe-area-inset-bottom));border-radius:32px 32px 0 0;background:var(--surface);box-shadow:0 -8px 30px rgba(0,0,0,.035); }.interaction-area h2 { margin:0 0 20px;font-size:24px;letter-spacing:-.03em; }.form-field { margin-top:14px; }.form-field label { display:block;margin:0 0 8px 2px;font-size:14px;font-weight:650; }.field-box { min-height:56px;display:flex;align-items:center;border-radius:16px;background:var(--field);transition:background .16s ease; }.field-box:focus-within { background:var(--blue-soft); }.field-icon { width:54px;flex:0 0 54px;display:grid;place-items:center;color:var(--muted); }.field-box:focus-within .field-icon { color:var(--blue); }.register-input { width:100%;min-height:56px;padding:0 14px 0 0;border:0;outline:0;background:transparent;color:var(--text);font:inherit;font-size:16px;caret-color:var(--blue); }.register-input::placeholder { color:var(--muted); }.register-input::selection { background:color-mix(in srgb,var(--blue) 30%,transparent); }.password-input { padding-right:48px; }.password-box { position:relative; }.password-button { position:absolute;right:4px;top:4px;color:var(--muted); }.strength { display:flex;align-items:center;gap:10px;margin:10px 2px 0; }.strength-bars { flex:1;display:flex;gap:4px; }.strength-bar { height:4px;flex:1;border-radius:999px;background:var(--line); }.strength-label { width:40px;text-align:right;font-size:12px;font-weight:650; }
        .error-message { margin:14px 2px 0;color:var(--error);font-size:14px;line-height:1.35; }.create-button { width:100%;min-height:52px;margin-top:24px;border:0;border-radius:16px;background:var(--blue);color:${darkMode ? "#101114" : "#fff"};font:inherit;font-size:16px;font-weight:750;cursor:pointer;transition:transform .14s ease,filter .14s ease; }.create-button:hover:not(:disabled) { filter:brightness(.96); }.create-button:active:not(:disabled) { transform:scale(.985); }.create-button:disabled { opacity:.55;cursor:progress; }.signin-link { margin:22px 0 0;color:var(--muted);text-align:center;font-size:15px; }.signin-link button { margin-left:4px;padding:4px;border:0;color:var(--blue);background:transparent;font:inherit;font-weight:700;cursor:pointer; }.fine-print { margin:16px 8px 0;color:var(--muted);text-align:center;font-size:12px;line-height:1.45; }.theme-button:focus-visible,.password-button:focus-visible,.create-button:focus-visible,.signin-link button:focus-visible { outline:3px solid color-mix(in srgb,var(--blue) 42%,transparent);outline-offset:2px; }.register-input:focus-visible { outline:0; }
        @media (min-width:700px) { .samsung-register { display:grid;place-items:center;padding:28px; }.samsung-shell { min-height:780px;border-radius:36px;overflow:hidden;background:var(--bg);box-shadow:0 20px 56px rgba(0,0,0,.16); }.interaction-area { margin:0 -20px;padding-left:28px;padding-right:28px; } } @media (prefers-reduced-motion:reduce) { .samsung-register * { transition:none !important; } }
      `}</style>
      <div className="samsung-shell">
        <header className="samsung-topbar">
          <button
            className="theme-button"
            type="button"
            onClick={toggleDarkMode}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <Icon name={darkMode ? "sun" : "moon"} />
          </button>
        </header>
        <section className="view-area" aria-labelledby="register-title">
          <div className="identity">
            <img src={appLogo} alt="ikigAI logo" />
            ikigAI
          </div>
          <h1 id="register-title">Build a life that feels like yours.</h1>
          <p>
            Start with a small daily check-in. Your progress becomes clearer
            over time.
          </p>
        </section>
        <section
          className="interaction-area"
          aria-labelledby="create-account-title"
        >
          <h2 id="create-account-title">Create account</h2>
          <form onSubmit={handleRegister} noValidate>
            <div className="form-field">
              <label htmlFor="register-name">Your name</label>
              <div className="field-box">
                <span className="field-icon">
                  <Icon name="person" />
                </span>
                <input
                  id="register-name"
                  className="register-input"
                  type="text"
                  autoComplete="name"
                  placeholder="What should we call you?"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  aria-describedby={error ? "register-error" : undefined}
                />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="register-email">Email address</label>
              <div className="field-box">
                <span className="field-icon">
                  <Icon name="mail" />
                </span>
                <input
                  id="register-email"
                  className="register-input"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-describedby={error ? "register-error" : undefined}
                />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="register-password">Password</label>
              <div className="field-box password-box">
                <span className="field-icon">
                  <Icon name="lock" />
                </span>
                <input
                  id="register-password"
                  className="register-input password-input"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-describedby={
                    error ? "register-error password-strength" : " "
                  }
                />
                <button
                  className="password-button"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon name={showPassword ? "eyeOff" : "eye"} />
                </button>
              </div>
              {password && (
                <div className="strength" id="password-strength">
                  <div className="strength-bars">
                    {[1, 2, 3, 4].map((level) => (
                      <span
                        key={level}
                        className="strength-bar"
                        style={{
                          background:
                            level <= strength ? strengthColor : undefined,
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="strength-label"
                    style={{ color: strengthColor }}
                  >
                    {strengthLabel}
                  </span>
                </div>
              )}
            </div>
            {error && (
              <p id="register-error" className="error-message" role="alert">
                {error}
              </p>
            )}
            <button className="create-button" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="signin-link">
            Already have an account?
            <button type="button" onClick={goToLogin}>
              Sign in
            </button>
          </p>
          <p className="fine-print">
            By creating an account, you can start a private record of your daily
            growth.
          </p>
        </section>
      </div>
    </main>
  );
}
