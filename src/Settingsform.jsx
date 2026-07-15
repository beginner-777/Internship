import { useState } from "react";
import { Check, AlertCircle, Circle, Loader2 } from "lucide-react";

// ---- Validation rules -------------------------------------------------

const validators = {
  displayName: (v) => {
    if (!v.trim()) return "Display name is required";
    if (v.trim().length < 2) return "Must be at least 2 characters";
    if (v.trim().length > 40) return "Must be under 40 characters";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address";
    return "";
  },
  password: (v) => {
    if (!v) return ""; // optional — only validated if the person is changing it
    if (v.length < 8) return "Must be at least 8 characters";
    if (!/[0-9]/.test(v)) return "Include at least one number";
    return "";
  },
  confirmPassword: (v, all) => {
    if (!all.password) return "";
    if (v !== all.password) return "Passwords don't match";
    return "";
  },
  bio: (v) => {
    if (v.length > 160) return "Keep it under 160 characters";
    return "";
  },
};

const initialValues = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
  bio: "",
  notify: "important",
  twoFactor: false,
};

// ---- Field status indicator -------------------------------------------

function StatusDot({ touched, error, value }) {
  if (!touched || value === "") return <Circle size={7} className="dot dot-idle" fill="currentColor" />;
  if (error) return <Circle size={7} className="dot dot-error" fill="currentColor" />;
  return <Circle size={7} className="dot dot-ok" fill="currentColor" />;
}

export default function SettingsForm() {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | saving | saved

  const setField = (name, value) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name]) {
      validateField(name, value, next);
    }
    if (name === "password" && touched.confirmPassword) {
      validateField("confirmPassword", next.confirmPassword, next);
    }
  };

  const validateField = (name, value, all = values) => {
    const rule = validators[name];
    if (!rule) return "";
    const message = rule(value, all);
    setErrors((prev) => ({ ...prev, [name]: message }));
    return message;
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, values[name]);
  };

  const validateAll = () => {
    const nextErrors = {};
    Object.keys(validators).forEach((name) => {
      nextErrors[name] = validators[name](values[name], values);
    });
    setErrors(nextErrors);
    setTouched(
      Object.keys(validators).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );
    return Object.values(nextErrors).every((m) => !m);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    setStatus("saving");
    setTimeout(() => {
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2200);
    }, 900);
  };

  const fieldClass = (name) =>
    `field-input${touched[name] && errors[name] ? " field-input-error" : ""}`;

  return (
    <div className="panel-wrap">
      <style>{`
        .panel-wrap {
          --bg: #12151a;
          --panel: #1a1e25;
          --panel-raised: #1f242c;
          --border: #2a2f38;
          --text: #e6e9ed;
          --muted: #8891a0;
          --accent: #e8a33d;
          --accent-dim: #a97a35;
          --ok: #4ade80;
          --err: #f87171;
          font-family: 'Inter', -apple-system, sans-serif;
          background: var(--bg);
          padding: 40px 20px;
          border-radius: 16px;
          display: flex;
          justify-content: center;
        }
        .panel {
          width: 100%;
          max-width: 480px;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }
        .panel-header {
          padding: 22px 26px 18px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }
        .panel-title {
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: var(--text);
        }
        .panel-sub {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          color: var(--muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .section {
          padding: 22px 26px;
          border-bottom: 1px solid var(--border);
        }
        .section:last-of-type { border-bottom: none; }
        .section-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent-dim);
          margin: 0 0 16px;
        }
        .field { margin-bottom: 16px; }
        .field:last-child { margin-bottom: 0; }
        .field-label-row {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 7px;
        }
        .field-label {
          font-size: 12.5px;
          color: var(--muted);
          font-weight: 500;
        }
        .dot-idle { color: #3a4049; }
        .dot-ok { color: var(--ok); }
        .dot-error { color: var(--err); }
        .field-input {
          width: 100%;
          box-sizing: border-box;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 7px;
          padding: 10px 12px;
          font-size: 13.5px;
          color: var(--text);
          font-family: inherit;
          outline: none;
          transition: border-color 0.15s ease;
        }
        .field-input::placeholder { color: #545b66; }
        .field-input:focus { border-color: var(--accent-dim); }
        .field-input-error { border-color: var(--err); }
        textarea.field-input { resize: vertical; min-height: 64px; }
        .field-error {
          margin-top: 6px;
          font-size: 11.5px;
          color: var(--err);
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .field-hint {
          margin-top: 6px;
          font-size: 11px;
          color: #545b66;
        }
        .radio-row {
          display: flex;
          gap: 8px;
        }
        .radio-pill {
          flex: 1;
          text-align: center;
          padding: 8px 6px;
          border-radius: 7px;
          border: 1px solid var(--border);
          background: var(--bg);
          font-size: 12px;
          color: var(--muted);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .radio-pill-active {
          border-color: var(--accent-dim);
          color: var(--accent);
          background: rgba(232, 163, 61, 0.08);
        }
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .toggle-copy { max-width: 320px; }
        .toggle-title { font-size: 13px; color: var(--text); margin: 0 0 2px; }
        .toggle-desc { font-size: 11.5px; color: var(--muted); margin: 0; }
        .toggle-switch {
          width: 38px;
          height: 22px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg);
          position: relative;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }
        .toggle-switch-on { background: rgba(232, 163, 61, 0.25); border-color: var(--accent-dim); }
        .toggle-knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--muted);
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .toggle-knob-on { transform: translateX(16px); background: var(--accent); }
        .panel-footer {
          padding: 20px 26px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }
        .save-status {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--ok);
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .submit-btn {
          background: var(--accent);
          color: #14181f;
          border: none;
          border-radius: 7px;
          padding: 10px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: filter 0.15s ease;
        }
        .submit-btn:hover { filter: brightness(1.08); }
        .submit-btn:disabled { opacity: 0.6; cursor: default; }
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <form className="panel" onSubmit={handleSubmit} noValidate>
        <div className="panel-header">
          <span className="panel-title">Account settings</span>
          <span className="panel-sub">Panel 01 / 03</span>
        </div>

        <div className="section">
          <p className="section-label">Profile</p>

          <div className="field">
            <div className="field-label-row">
              <StatusDot touched={touched.displayName} error={errors.displayName} value={values.displayName} />
              <span className="field-label">Display name</span>
            </div>
            <input
              className={fieldClass("displayName")}
              value={values.displayName}
              onChange={(e) => setField("displayName", e.target.value)}
              onBlur={() => handleBlur("displayName")}
              placeholder="Jordan Reyes"
            />
            {touched.displayName && errors.displayName && (
              <div className="field-error"><AlertCircle size={12} />{errors.displayName}</div>
            )}
          </div>

          <div className="field">
            <div className="field-label-row">
              <StatusDot touched={touched.email} error={errors.email} value={values.email} />
              <span className="field-label">Email</span>
            </div>
            <input
              className={fieldClass("email")}
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="jordan@example.com"
            />
            {touched.email && errors.email && (
              <div className="field-error"><AlertCircle size={12} />{errors.email}</div>
            )}
          </div>

          <div className="field">
            <div className="field-label-row">
              <span className="field-label">Bio</span>
            </div>
            <textarea
              className={fieldClass("bio")}
              value={values.bio}
              onChange={(e) => setField("bio", e.target.value)}
              onBlur={() => handleBlur("bio")}
              placeholder="A short line about you"
            />
            <div className="field-hint">
              {values.bio.length}/160
              {touched.bio && errors.bio ? ` — ${errors.bio}` : ""}
            </div>
          </div>
        </div>

        <div className="section">
          <p className="section-label">Password</p>

          <div className="field">
            <div className="field-label-row">
              <StatusDot touched={touched.password} error={errors.password} value={values.password} />
              <span className="field-label">New password</span>
            </div>
            <input
              type="password"
              className={fieldClass("password")}
              value={values.password}
              onChange={(e) => setField("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              placeholder="Leave blank to keep current password"
            />
            {touched.password && errors.password && (
              <div className="field-error"><AlertCircle size={12} />{errors.password}</div>
            )}
          </div>

          <div className="field">
            <div className="field-label-row">
              <StatusDot touched={touched.confirmPassword} error={errors.confirmPassword} value={values.confirmPassword} />
              <span className="field-label">Confirm password</span>
            </div>
            <input
              type="password"
              className={fieldClass("confirmPassword")}
              value={values.confirmPassword}
              onChange={(e) => setField("confirmPassword", e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              placeholder="Repeat new password"
              disabled={!values.password}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <div className="field-error"><AlertCircle size={12} />{errors.confirmPassword}</div>
            )}
          </div>
        </div>

        <div className="section">
          <p className="section-label">Notifications</p>

          <div className="field">
            <div className="field-label-row">
              <span className="field-label">Email me about</span>
            </div>
            <div className="radio-row">
              {[
                { key: "all", label: "Everything" },
                { key: "important", label: "Important only" },
                { key: "none", label: "Nothing" },
              ].map((opt) => (
                <div
                  key={opt.key}
                  className={`radio-pill${values.notify === opt.key ? " radio-pill-active" : ""}`}
                  onClick={() => setField("notify", opt.key)}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </div>

          <div className="field">
            <div className="toggle-row">
              <div className="toggle-copy">
                <p className="toggle-title">Two-factor authentication</p>
                <p className="toggle-desc">Require a code from your phone when signing in.</p>
              </div>
              <div
                className={`toggle-switch${values.twoFactor ? " toggle-switch-on" : ""}`}
                onClick={() => setField("twoFactor", !values.twoFactor)}
              >
                <div className={`toggle-knob${values.twoFactor ? " toggle-knob-on" : ""}`} />
              </div>
            </div>
          </div>
        </div>

        <div className="panel-footer">
          {status === "saved" && (
            <span className="save-status"><Check size={13} /> Saved</span>
          )}
          <button className="submit-btn" type="submit" disabled={status === "saving"}>
            {status === "saving" ? (
              <>
                <Loader2 size={14} className="spin" /> Saving
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}