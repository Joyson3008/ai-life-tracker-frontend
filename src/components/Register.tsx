import { useState } from "react";
import type { FormEvent } from "react";
import { useTheme } from "../context/ThemeContext";
import appLogo from "../assets/ikigai-logo.png";

type Props = {
  onRegisterSuccess: () => void;
  goToLogin: () => void;
};

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

  const strengthColor = ["", "#d83933", "#d77a1f", "#007aff", "#248a3d"][
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
          headers: {
            "Content-Type": "application/json",
          },
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
      className={`ikigai-register ${
        darkMode ? "ikigai-register-dark" : "ikigai-register-light"
      }`}
    >
      <style>{`
        .ikigai-register {
          --page: #f2f2f7;
          --surface: #fff;
          --text: #1c1c1e;
          --secondary: #6d6d72;
          --separator: #c6c6c8;
          --blue: #007aff;
          --blue-pressed: #0069d9;
          --error: #c7322b;

          min-height: 100svh;
          background: var(--page);
          color: var(--text);
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            "SF Pro Text",
            "Helvetica Neue",
            Arial,
            sans-serif;
        }

        .ikigai-register-dark {
          --page: #000;
          --surface: #1c1c1e;
          --text: #f5f5f7;
          --secondary: #a1a1a6;
          --separator: #3a3a3c;
          --blue: #0a84ff;
          --blue-pressed: #409cff;
          --error: #ff6961;
        }

        .ikigai-register-shell {
          width: min(100%, 430px);
          min-height: 100svh;
          margin: 0 auto;

          padding:
            max(16px, env(safe-area-inset-top))
            20px
            max(30px, env(safe-area-inset-bottom));

          box-sizing: border-box;

          display: flex;
          flex-direction: column;
        }

        /* HEADER */

        .ikigai-register-nav {
          min-height: 48px;

          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ikigai-register-brand {
          display: flex;
          align-items: center;
          gap: 10px;

          color: var(--text);

          font-size: 17px;
          font-weight: 650;

          letter-spacing: -0.025em;
        }

        /* IMPORTANT: resized to match Login */

        .ikigai-register-logo {
          width: 32px;
          height: 32px;

          flex: 0 0 32px;

          border-radius: 8px;

          object-fit: cover;

          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.14);
        }

        .ikigai-register-theme {
          width: 44px;
          height: 44px;

          padding: 0;

          display: grid;
          place-items: center;

          border: 0;
          border-radius: 50%;

          color: var(--blue);
          background: transparent;

          cursor: pointer;
        }

        .ikigai-register-theme:hover {
          background: color-mix(
            in srgb,
            var(--blue) 10%,
            transparent
          );
        }

        .ikigai-register-theme svg {
          width: 20px;
          height: 20px;
        }

        /* INTRO */

        .ikigai-register-intro {
          padding: 38px 0 30px;
        }

        .ikigai-register-intro h1 {
          max-width: 340px;

          margin: 0;

          font-size: clamp(34px, 9vw, 40px);
          line-height: 1.08;

          letter-spacing: -0.045em;

          font-weight: 700;
        }

        .ikigai-register-intro p {
          max-width: 340px;

          margin: 13px 0 0;

          color: var(--secondary);

          font-size: 17px;
          line-height: 1.42;

          letter-spacing: -0.01em;
        }

        /* FORM */

        .ikigai-register-content {
          margin-top: auto;
        }

        .ikigai-register-content h2 {
          margin: 0 0 14px;
          padding-left: 2px;

          font-size: 22px;
          line-height: 1.25;

          letter-spacing: -0.025em;

          font-weight: 700;
        }

        .ikigai-register-field {
          margin-top: 12px;
        }

        .ikigai-register-field label {
          display: block;

          margin: 0 0 7px;
          padding-left: 2px;

          font-size: 14px;
          font-weight: 600;
        }

        .ikigai-register-input-box {
          position: relative;

          min-height: 56px;

          display: flex;
          align-items: center;

          border-radius: 14px;

          background: var(--surface);

          border: 1px solid var(--separator);

          transition:
            background 0.16s ease,
            border-color 0.16s ease;
        }

        .ikigai-register-input-box:focus-within {
          background: color-mix(
            in srgb,
            var(--blue) 10%,
            var(--surface)
          );

          border-color: transparent;
        }

        .ikigai-register-field-icon {
          width: 54px;
          flex: 0 0 54px;

          display: grid;
          place-items: center;

          color: var(--secondary);
        }

        .ikigai-register-field-icon svg {
          width: 20px;
          height: 20px;
        }

        .ikigai-register-input-box:focus-within
          .ikigai-register-field-icon {
          color: var(--blue);
        }

        .ikigai-register-input {
          width: 100%;
          min-height: 54px;

          padding: 0 14px 0 0;

          border: 0;
          outline: 0;

          color: var(--text);
          background: transparent;

          font: inherit;
          font-size: 16px;

          letter-spacing: -0.01em;

          caret-color: var(--blue);
        }

        .ikigai-register-input::placeholder {
          color: var(--secondary);
        }

        .ikigai-register-input:focus,
        .ikigai-register-input:focus-visible {
          outline: 0;
          box-shadow: none;
        }

        .ikigai-register-password {
          padding-right: 48px;
        }

        .ikigai-register-password-toggle {
          position: absolute;

          right: 4px;
          top: 4px;

          width: 44px;
          height: 44px;

          padding: 0;

          display: grid;
          place-items: center;

          border: 0;
          border-radius: 50%;

          color: var(--secondary);
          background: transparent;

          cursor: pointer;
        }

        .ikigai-register-password-toggle:hover {
          background: color-mix(
            in srgb,
            var(--blue) 10%,
            transparent
          );
        }

        .ikigai-register-password-toggle svg {
          width: 20px;
          height: 20px;
        }

        /* PASSWORD STRENGTH */

        .ikigai-register-strength {
          display: flex;
          align-items: center;

          gap: 10px;

          margin: 9px 2px 0;
        }

        .ikigai-register-strength-bars {
          flex: 1;

          display: flex;

          gap: 4px;
        }

        .ikigai-register-strength-bar {
          height: 4px;

          flex: 1;

          border-radius: 999px;

          background: var(--separator);
        }

        .ikigai-register-strength-label {
          width: 40px;

          text-align: right;

          font-size: 12px;
          font-weight: 650;
        }

        /* ERROR */

        .ikigai-register-error {
          margin: 12px 2px 0;

          color: var(--error);

          font-size: 14px;
          line-height: 1.35;
        }

        /* BUTTON */

        .ikigai-register-submit {
          width: 100%;

          min-height: 50px;

          margin-top: 24px;
          padding: 0 18px;

          border: 0;
          border-radius: 12px;

          background: var(--blue);
          color: #fff;

          font: inherit;
          font-size: 17px;
          font-weight: 600;

          cursor: pointer;

          transition:
            transform 0.14s ease,
            background 0.14s ease;
        }

        .ikigai-register-submit:hover:not(:disabled) {
          background: var(--blue-pressed);
        }

        .ikigai-register-submit:active:not(:disabled) {
          transform: scale(0.985);
        }

        .ikigai-register-submit:disabled {
          opacity: 0.55;
          cursor: progress;
        }

        /* LOGIN LINK */

        .ikigai-register-login-link {
          margin: 22px 0 0;

          color: var(--secondary);

          text-align: center;

          font-size: 15px;
        }

        .ikigai-register-login-link button {
          margin-left: 4px;
          padding: 4px;

          border: 0;

          color: var(--blue);
          background: transparent;

          font: inherit;
          font-weight: 600;

          cursor: pointer;
        }

        /* FOOTER */

        .ikigai-register-privacy {
          margin: 17px 6px 0;

          color: var(--secondary);

          text-align: center;

          font-size: 12px;
          line-height: 1.4;
        }

        /* ACCESSIBILITY */

        .ikigai-register-theme:focus-visible,
        .ikigai-register-password-toggle:focus-visible,
        .ikigai-register-submit:focus-visible,
        .ikigai-register-login-link button:focus-visible {
          outline: 3px solid
            color-mix(in srgb, var(--blue) 42%, transparent);

          outline-offset: 2px;
        }

        /* DESKTOP */

        @media (min-width: 700px) {
          .ikigai-register {
            display: grid;
            place-items: center;
            padding: 32px;
          }

          .ikigai-register-shell {
            min-height: 680px;

            padding: 20px 28px 30px;

            border-radius: 30px;

            background: var(--page);

            box-shadow: 0 18px 52px rgba(0, 0, 0, 0.14);
          }

          .ikigai-register-intro {
            padding-top: 54px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ikigai-register * {
            transition: none !important;
          }
        }
      `}</style>

      <div className="ikigai-register-shell">
        {/* HEADER */}
        <header className="ikigai-register-nav">
          <span className="ikigai-register-brand">
            <img className="ikigai-register-logo" src={appLogo} alt="ikigAI" />
            IKIG-AI
          </span>

          <button
            className="ikigai-register-theme"
            type="button"
            onClick={toggleDarkMode}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <Icon name={darkMode ? "sun" : "moon"} />
          </button>
        </header>

        {/* INTRO */}
        <section
          className="ikigai-register-intro"
          aria-labelledby="register-title"
        >
          <h1 id="register-title">Make each day count.</h1>

          <p>
            Create a private space to notice your patterns and grow with
            intention.
          </p>
        </section>

        {/* FORM */}
        <section
          className="ikigai-register-content"
          aria-labelledby="create-account-title"
        >
          <h2 id="create-account-title">Create account</h2>

          <form onSubmit={handleRegister} noValidate>
            {/* NAME */}
            <div className="ikigai-register-field">
              <label htmlFor="register-name">Your name</label>

              <div className="ikigai-register-input-box">
                <span className="ikigai-register-field-icon">
                  <Icon name="person" />
                </span>

                <input
                  id="register-name"
                  className="ikigai-register-input"
                  type="text"
                  autoComplete="name"
                  placeholder="What should we call you?"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  aria-describedby={error ? "register-error" : undefined}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="ikigai-register-field">
              <label htmlFor="register-email">Email address</label>

              <div className="ikigai-register-input-box">
                <span className="ikigai-register-field-icon">
                  <Icon name="mail" />
                </span>

                <input
                  id="register-email"
                  className="ikigai-register-input"
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

            {/* PASSWORD */}
            <div className="ikigai-register-field">
              <label htmlFor="register-password">Password</label>

              <div className="ikigai-register-input-box">
                <span className="ikigai-register-field-icon">
                  <Icon name="lock" />
                </span>

                <input
                  id="register-password"
                  className="ikigai-register-input ikigai-register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-describedby={
                    error ? "register-error password-strength" : undefined
                  }
                />

                <button
                  className="ikigai-register-password-toggle"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon name={showPassword ? "eyeOff" : "eye"} />
                </button>
              </div>

              {/* PASSWORD STRENGTH */}
              {password && (
                <div
                  className="ikigai-register-strength"
                  id="password-strength"
                >
                  <div className="ikigai-register-strength-bars">
                    {[1, 2, 3, 4].map((level) => (
                      <span
                        key={level}
                        className="ikigai-register-strength-bar"
                        style={{
                          background:
                            level <= strength ? strengthColor : undefined,
                        }}
                      />
                    ))}
                  </div>

                  <span
                    className="ikigai-register-strength-label"
                    style={{
                      color: strengthColor,
                    }}
                  >
                    {strengthLabel}
                  </span>
                </div>
              )}
            </div>

            {/* ERROR */}
            {error && (
              <p
                id="register-error"
                className="ikigai-register-error"
                role="alert"
              >
                {error}
              </p>
            )}

            {/* CREATE ACCOUNT */}
            <button
              className="ikigai-register-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* LOGIN */}
          <p className="ikigai-register-login-link">
            Already have an account?
            <button type="button" onClick={goToLogin}>
              Sign in
            </button>
          </p>

          {/* PRIVACY */}
          <p className="ikigai-register-privacy">
            Your reflections are private and designed to stay personal.
          </p>
        </section>
      </div>
    </main>
  );
}
