import { useState } from "react";
import type { FormEvent } from "react";
import { useTheme } from "../context/ThemeContext";
import appLogo from "../assets/ikigai-logo.png";

type Props = { setUserId: (id: number) => void; goToRegister: () => void };

function Icon({
  name,
}: {
  name: "mail" | "lock" | "eye" | "eyeOff" | "sun" | "moon";
}) {
  const paths = {
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

export default function Login({ setUserId, goToRegister }: Props) {
  const { darkMode, toggleDarkMode } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email address and password to continue.");
      return;
    }
    try {
      setError("");
      setLoading(true);
      const response = await fetch(
        "https://ai-life-tracker.onrender.com/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        },
      );
      if (!response.ok) {
        setError(
          (await response.text()) ||
            "We couldn't sign you in. Check your details and try again.",
        );
        return;
      }
      const user = await response.json();
      setUserId(user.id);
      localStorage.setItem("userId", String(user.id));
    } catch (requestError) {
      console.error("Login error:", requestError);
      setError("Something went wrong. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`apple-login ${darkMode ? "apple-dark" : "apple-light"}`}>
      <style>{`
        .apple-login { --page:#f2f2f7;--surface:#fff;--text:#1c1c1e;--secondary:#6d6d72;--separator:#c6c6c8;--blue:#007aff;--blue-pressed:#0069d9;--error:#c7322b;min-height:100svh;background:var(--page);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",Arial,sans-serif; }
        .apple-dark { --page:#000;--surface:#1c1c1e;--text:#f5f5f7;--secondary:#a1a1a6;--separator:#3a3a3c;--blue:#0a84ff;--blue-pressed:#409cff;--error:#ff6961; }
        .apple-shell { width:min(100%,430px);min-height:100svh;margin:0 auto;padding:max(16px,env(safe-area-inset-top)) 20px max(30px,env(safe-area-inset-bottom));box-sizing:border-box;display:flex;flex-direction:column; }
        .apple-nav { min-height:48px;display:flex;align-items:center;justify-content:space-between; }.brand { display:flex;align-items:center;gap:10px;color:var(--text);font-size:17px;font-weight:650;letter-spacing:-.025em; }.brand-logo { width:32px;height:32px;border-radius:8px;object-fit:cover;box-shadow:0 1px 3px rgba(0,0,0,.14); }
        .icon-button { width:44px;height:44px;padding:0;display:grid;place-items:center;border:0;border-radius:50%;color:var(--blue);background:transparent;cursor:pointer; }.icon-button:hover { background:color-mix(in srgb,var(--blue) 10%,transparent); }.icon-button svg { width:20px;height:20px; }
        .intro { padding:38px 0 30px; }.intro h1 { max-width:340px;margin:0;font-size:clamp(34px,9vw,40px);line-height:1.08;letter-spacing:-.045em;font-weight:700; }.intro p { max-width:340px;margin:13px 0 0;color:var(--secondary);font-size:17px;line-height:1.42;letter-spacing:-.01em; }
        .login-content { margin-top:auto; }.login-content h2 { margin:0 0 14px;padding-left:2px;font-size:22px;line-height:1.25;letter-spacing:-.025em;font-weight:700; }.login-field { margin-top:12px; }.login-field label { display:block;margin:0 0 7px;padding-left:2px;font-size:14px;font-weight:600; }.field { position:relative;min-height:56px;display:flex;align-items:center;border-radius:14px;background:var(--surface);border:1px solid var(--separator);transition:background .16s ease,border-color .16s ease; }.field-icon { width:54px;flex:0 0 54px;display:grid;place-items:center;color:var(--secondary); }.field-icon svg { width:20px;height:20px; }
        .apple-input { width:100%;min-height:54px;padding:0 14px 0 0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;font-size:16px;letter-spacing:-.01em;caret-color:var(--blue); }.apple-input::placeholder { color:var(--secondary); }.apple-input::selection { background:color-mix(in srgb,var(--blue) 28%,transparent); }.apple-input:focus,.apple-input:focus-visible { outline:0;box-shadow:none; }.password-input { padding-right:48px; }.password-toggle { position:absolute;right:4px;top:4px;width:44px;height:44px;color:var(--secondary); }.field:focus-within { background:color-mix(in srgb,var(--blue) 10%,var(--surface));border-color:transparent;box-shadow:none; }.field:focus-within .field-icon { color:var(--blue); }
        .error-message { margin:12px 2px 0;color:var(--error);font-size:14px;line-height:1.35; }.sign-in { width:100%;min-height:50px;margin-top:24px;padding:0 18px;border:0;border-radius:12px;background:var(--blue);color:#fff;font:inherit;font-size:17px;font-weight:600;cursor:pointer;transition:transform .14s ease,background .14s ease; }.sign-in:hover:not(:disabled) { background:var(--blue-pressed); }.sign-in:active:not(:disabled) { transform:scale(.985); }.sign-in:disabled { opacity:.55;cursor:progress; }
        .register { margin:22px 0 0;color:var(--secondary);text-align:center;font-size:15px; }.register button { margin-left:4px;padding:4px;border:0;color:var(--blue);background:transparent;font:inherit;font-weight:600;cursor:pointer; }.privacy { margin:17px 6px 0;color:var(--secondary);text-align:center;font-size:12px;line-height:1.4; }.icon-button:focus-visible,.apple-input:focus-visible,.sign-in:focus-visible,.register button:focus-visible { outline:3px solid color-mix(in srgb,var(--blue) 42%,transparent);outline-offset:2px; }
        @media (min-width:700px) { .apple-login { display:grid;place-items:center;padding:32px; }.apple-shell { min-height:680px;padding:20px 28px 30px;border-radius:30px;background:var(--page);box-shadow:0 18px 52px rgba(0,0,0,.14); }.intro { padding-top:54px; } } @media (prefers-reduced-motion:reduce) { .apple-login * { transition:none !important; } }
      `}</style>
      <div className="apple-shell">
        <header className="apple-nav">
          <span className="brand">
            <img className="brand-logo" src={appLogo} alt="ikigAI" />
            IKIG-AI
          </span>
          <button
            className="icon-button"
            type="button"
            onClick={toggleDarkMode}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <Icon name={darkMode ? "sun" : "moon"} />
          </button>
        </header>
        <section className="intro" aria-labelledby="login-title">
          <h1 id="login-title">Your day, in focus.</h1>
          <p>
            Track what matters, reflect with clarity, and keep moving forward.
          </p>
        </section>
        <section className="login-content" aria-labelledby="sign-in-title">
          <h2 id="sign-in-title">Sign in</h2>
          <form onSubmit={handleLogin} noValidate>
            <div className="login-field">
              <label htmlFor="login-email">Email address</label>
              <div className="field">
                <span className="field-icon">
                  <Icon name="mail" />
                </span>
                <input
                  id="login-email"
                  className="apple-input"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-describedby={error ? "login-error" : undefined}
                />
              </div>
            </div>
            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <div className="field">
                <span className="field-icon">
                  <Icon name="lock" />
                </span>
                <input
                  id="login-password"
                  className="apple-input password-input"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-describedby={error ? "login-error" : undefined}
                />
                <button
                  className="icon-button password-toggle"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon name={showPassword ? "eyeOff" : "eye"} />
                </button>
              </div>
            </div>
            {error && (
              <p id="login-error" className="error-message" role="alert">
                {error}
              </p>
            )}
            <button className="sign-in" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="register">
            New to IKIG-AI?
            <button type="button" onClick={goToRegister}>
              Create account
            </button>
          </p>
          <p className="privacy">
            Your reflections are private and designed to stay personal.
          </p>
        </section>
      </div>
    </main>
  );
}
