import { useState } from "react";
import type { FormEvent } from "react";
import { useTheme } from "../context/ThemeContext";

type Props = {
  setUserId: (id: number) => void;
  goToRegister: () => void;
};

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
      strokeWidth="1.9"
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
        const message = await response.text();
        setError(
          message ||
            "We couldn't sign you in. Check your details and try again.",
        );
        return;
      }

      const user = await response.json();
      setUserId(user.id);
      localStorage.setItem("userId", String(user.id));
    } catch (requestError) {
      console.error("Login error:", requestError);
      setError(
        "Something went wrong. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`oneui-login ${darkMode ? "oneui-dark" : "oneui-light"}`}>
      <style>{`
        .oneui-login { --bg: #f7f7fa; --surface: #ffffff; --surface-subtle: #f0f0f5; --text: #17171b; --muted: #6f707a; --line: #dfdfe5; --accent: #4f46e5; --accent-pressed: #3730a3; --field: #f1f1f5; --error: #b3261e; min-height: 100svh; background: var(--bg); color: var(--text); font-family: Inter, Roboto, Arial, sans-serif; }
        .oneui-dark { --bg: #141419; --surface: #202025; --surface-subtle: #2b2b31; --text: #f5f5f7; --muted: #acaeb8; --line: #383840; --accent: #aeb1ff; --accent-pressed: #c5c7ff; --field: #2b2b31; --error: #ffb4ab; }
        .oneui-shell { width: min(100%, 520px); min-height: 100svh; margin: 0 auto; display: flex; flex-direction: column; padding: max(20px, env(safe-area-inset-top)) 20px max(24px, env(safe-area-inset-bottom)); box-sizing: border-box; }
        .oneui-topbar { display: flex; justify-content: flex-end; min-height: 48px; }
        .theme-button, .icon-button { width: 48px; height: 48px; border: 0; border-radius: 50%; display: inline-grid; place-items: center; color: var(--text); background: transparent; cursor: pointer; -webkit-tap-highlight-color: transparent; }
        .theme-button:hover, .icon-button:hover { background: var(--surface-subtle); }
        .theme-button:focus-visible, .icon-button:focus-visible, .oneui-button:focus-visible, .create-account:focus-visible, .oneui-input:focus-visible { outline: 3px solid color-mix(in srgb, var(--accent) 48%, transparent); outline-offset: 2px; }
        .theme-button svg, .icon-button svg, .field-icon svg { width: 21px; height: 21px; }
        .oneui-intro { padding: 34px 4px 30px; }
        .eyebrow { display: block; margin: 0 0 12px; color: var(--accent); font-size: 14px; font-weight: 700; letter-spacing: .02em; }
        .oneui-intro h1 { max-width: 360px; margin: 0; font-size: clamp(34px, 9vw, 44px); line-height: 1.08; letter-spacing: -.045em; font-weight: 750; }
        .oneui-intro p { max-width: 350px; margin: 14px 0 0; color: var(--muted); font-size: 16px; line-height: 1.5; }
        .oneui-panel { margin-top: auto; padding: 28px 20px 22px; border: 1px solid var(--line); border-radius: 28px; background: var(--surface); box-shadow: 0 6px 18px rgba(0,0,0,.04); }
        .oneui-panel h2 { margin: 0 0 22px; font-size: 22px; letter-spacing: -.025em; }
        .field { margin-top: 16px; }
        .field label { display: block; margin: 0 0 8px; font-size: 14px; font-weight: 650; }
        .field-control { position: relative; }
        .field-icon { position: absolute; left: 16px; top: 50%; display: grid; place-items: center; transform: translateY(-50%); color: var(--muted); pointer-events: none; }
        .oneui-input { width: 100%; min-height: 52px; padding: 0 48px; box-sizing: border-box; border: 1px solid transparent; border-radius: 14px; background: var(--field); color: var(--text); font: inherit; font-size: 16px; transition: border-color .18s ease, background .18s ease; }
        .oneui-input::placeholder { color: var(--muted); opacity: .82; }
        .oneui-input:focus { border-color: var(--accent); background: var(--surface); }
        .password-input { padding-right: 54px; }
        .password-toggle { position: absolute; right: 2px; top: 2px; }
        .error-message { margin: 16px 0 0; padding: 12px 14px; border-radius: 12px; background: color-mix(in srgb, var(--error) 12%, transparent); color: var(--error); font-size: 14px; line-height: 1.4; }
        .oneui-button { width: 100%; min-height: 52px; margin-top: 24px; border: 0; border-radius: 15px; background: var(--accent); color: ${darkMode ? "#202025" : "#ffffff"}; font: inherit; font-size: 16px; font-weight: 750; cursor: pointer; transition: transform .15s ease, background .15s ease; }
        .oneui-button:hover:not(:disabled) { background: var(--accent-pressed); }
        .oneui-button:active:not(:disabled) { transform: scale(.98); }
        .oneui-button:disabled { opacity: .58; cursor: progress; }
        .new-account { margin: 22px 0 0; color: var(--muted); text-align: center; font-size: 14px; }
        .create-account { margin-left: 5px; padding: 4px; border: 0; background: transparent; color: var(--accent); font: inherit; font-weight: 750; cursor: pointer; }
        .privacy-note { margin: 20px 4px 0; color: var(--muted); text-align: center; font-size: 12px; line-height: 1.45; }
        @media (min-width: 700px) { .oneui-login { display: grid; place-items: center; padding: 28px; } .oneui-shell { min-height: auto; padding: 18px; border: 1px solid var(--line); border-radius: 36px; background: var(--surface); box-shadow: 0 18px 46px rgba(0,0,0,.10); } .oneui-panel { margin-top: 0; padding: 28px; border: 0; box-shadow: none; background: transparent; } .oneui-intro { padding: 24px 12px 30px; } }
        @media (prefers-reduced-motion: reduce) { .oneui-login * { transition: none !important; } }
      `}</style>

      <div className="oneui-shell">
        <header className="oneui-topbar">
          <button
            className="theme-button"
            type="button"
            onClick={toggleDarkMode}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <Icon name={darkMode ? "sun" : "moon"} />
          </button>
        </header>

        <section className="oneui-intro" aria-labelledby="login-page-title">
          <span className="eyebrow">AI Life Tracker</span>
          <h1 id="login-page-title">
            A better day starts with a small check-in.
          </h1>
          <p>
            See your habits clearly and make steady progress, one day at a time.
          </p>
        </section>

        <section className="oneui-panel" aria-labelledby="sign-in-title">
          <h2 id="sign-in-title">Sign in</h2>
          <form onSubmit={handleLogin} noValidate>
            <div className="field">
              <label htmlFor="login-email">Email address</label>
              <div className="field-control">
                <span className="field-icon">
                  <Icon name="mail" />
                </span>
                <input
                  id="login-email"
                  className="oneui-input"
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
            <div className="field">
              <label htmlFor="login-password">Password</label>
              <div className="field-control">
                <span className="field-icon">
                  <Icon name="lock" />
                </span>
                <input
                  id="login-password"
                  className="oneui-input password-input"
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
            <button className="oneui-button" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="new-account">
            New to AI Life Tracker?
            <button
              className="create-account"
              type="button"
              onClick={goToRegister}
            >
              Create account
            </button>
          </p>
          <p className="privacy-note">
            Your daily reflections are personal. We keep the sign-in experience
            simple and secure.
          </p>
        </section>
      </div>
    </main>
  );
}
