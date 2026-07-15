import React, { useState, useCallback, useMemo } from "react";

/* ------------------------------------------------------------------ */
/*  validation.js  (kept in-file for artifact preview — in a real repo */
/*  this block would live in its own module and be imported)          */
/* ------------------------------------------------------------------ */

// Full RFC 5322 official standard regex (strict).
const RFC5322_EMAIL_REGEX =
  /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;

// At least one digit, one uppercase letter, min 8 chars total.
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[A-Z]).{8,}$/;

const BIO_MAX_LENGTH = 160;
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 40;

function validateDisplayName(value) {
  const v = (value || "").trim();
  if (!v) return "Display name is required.";
  if (v.length < NAME_MIN_LENGTH) return `Must be at least ${NAME_MIN_LENGTH} characters.`;
  if (v.length > NAME_MAX_LENGTH) return `Must be ${NAME_MAX_LENGTH} characters or fewer.`;
  return "";
}

function validateEmail(value) {
  const v = (value || "").trim();
  if (!v) return "Email is required.";
  if (!RFC5322_EMAIL_REGEX.test(v)) return "Enter a valid email address.";
  return "";
}

function validateBio(value) {
  const v = value || "";
  if (v.length > BIO_MAX_LENGTH) return `Bio must be ${BIO_MAX_LENGTH} characters or fewer.`;
  return "";
}

function validatePassword(value) {
  const v = value || "";
  if (!v) return ""; // optional field
  if (!PASSWORD_REGEX.test(v)) {
    return "Min. 8 characters, with at least one number and one uppercase letter.";
  }
  return "";
}

function validateConfirmPassword(password, confirmPassword) {
  const pw = password || "";
  const cpw = confirmPassword || "";
  if (!pw) return ""; // nothing to confirm if no new password was entered
  if (!cpw) return "Please confirm your new password.";
  if (pw !== cpw) return "Passwords do not match.";
  return "";
}

const validators = {
  displayName: validateDisplayName,
  email: validateEmail,
  bio: validateBio,
  password: validatePassword,
  // confirmPassword is handled specially since it depends on `password`
};

// Named exports so validation.js can be unit-tested in isolation
// (in a split-file project these live in their own module).
export {
  RFC5322_EMAIL_REGEX,
  PASSWORD_REGEX,
  validateDisplayName,
  validateEmail,
  validateBio,
  validatePassword,
  validateConfirmPassword,
};

/* ------------------------------------------------------------------ */
/*  styles.js  (kept in-file for the same reason as above)             */
/* ------------------------------------------------------------------ */

const colors = {
  bg: "#0f172a",
  card: "#161e33",
  border: "#2a3554",
  borderFocus: "#6366f1",
  borderError: "#f87171",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  textFaint: "#64748b",
  errorText: "#fca5a5",
  accent: "#6366f1",
  accentHover: "#4f46e5",
  success: "#34d399",
};

const styles = {
  page: {
    minHeight: "100%",
    background: colors.bg,
    display: "flex",
    justifyContent: "center",
    padding: "40px 16px",
    boxSizing: "border-box",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  card: {
    width: "100%",
    maxWidth: 480,
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: "32px 28px",
    boxSizing: "border-box",
    boxShadow: "0 20px 40px -20px rgba(0,0,0,0.6)",
  },
  heading: {
    color: colors.text,
    fontSize: 22,
    fontWeight: 600,
    margin: "0 0 4px 0",
  },
  subheading: {
    color: colors.textMuted,
    fontSize: 14,
    margin: "0 0 28px 0",
    lineHeight: 1.5,
  },
  fieldWrap: {
    marginBottom: 20,
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 6,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: 500,
  },
  optionalTag: {
    color: colors.textFaint,
    fontSize: 12,
    fontWeight: 400,
  },
  counter: {
    color: colors.textFaint,
    fontSize: 12,
    fontVariantNumeric: "tabular-nums",
  },
  counterWarn: {
    color: "#fbbf24",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    background: "#0f1526",
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 14,
    color: colors.text,
    outline: "none",
    transition: "border-color 120ms ease, box-shadow 120ms ease",
  },
  inputFocus: {
    borderColor: colors.borderFocus,
    boxShadow: `0 0 0 3px rgba(99,102,241,0.25)`,
  },
  inputError: {
    borderColor: colors.borderError,
  },
  inputDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  textarea: {
    resize: "vertical",
    minHeight: 80,
    fontFamily: "inherit",
  },
  errorText: {
    color: colors.errorText,
    fontSize: 12.5,
    marginTop: 6,
    lineHeight: 1.4,
  },
  helpText: {
    color: colors.textFaint,
    fontSize: 12,
    marginTop: 6,
    lineHeight: 1.4,
  },
  divider: {
    border: "none",
    borderTop: `1px solid ${colors.border}`,
    margin: "28px 0 20px 0",
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    margin: "0 0 16px 0",
  },
  submitBtn: {
    width: "100%",
    padding: "12px 16px",
    background: colors.accent,
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
    transition: "background 120ms ease, transform 80ms ease",
  },
  successBanner: {
    background: "rgba(52,211,153,0.1)",
    border: "1px solid rgba(52,211,153,0.4)",
    color: colors.success,
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 20,
  },
};

/* ------------------------------------------------------------------ */
/*  FormField.jsx  (reusable presentational sub-component)             */
/* ------------------------------------------------------------------ */

function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  disabled = false,
  as = "input",
  helpText,
  rightSlot,
  autoComplete,
}) {
  const [focused, setFocused] = useState(false);
  const showError = Boolean(touched && error);
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  const describedBy =
    [showError ? errorId : null, helpText ? helpId : null].filter(Boolean).join(" ") ||
    undefined;

  const inputStyle = {
    ...styles.input,
    ...(as === "textarea" ? styles.textarea : {}),
    ...(focused ? styles.inputFocus : {}),
    ...(showError ? styles.inputError : {}),
    ...(disabled ? styles.inputDisabled : {}),
  };

  const Tag = as === "textarea" ? "textarea" : "input";

  return (
    <div style={styles.fieldWrap}>
      <div style={styles.labelRow}>
        <label htmlFor={id} style={styles.label}>
          {label}
          {!required && <span style={styles.optionalTag}> (optional)</span>}
        </label>
        {rightSlot}
      </div>
      <Tag
        id={id}
        name={id}
        type={as === "input" ? type : undefined}
        value={value}
        disabled={disabled}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => {
          setFocused(false);
          onBlur(e.target.value);
        }}
        aria-invalid={showError}
        aria-describedby={describedBy}
        aria-required={required}
        style={inputStyle}
      />
      {showError && (
        <p id={errorId} role="alert" style={styles.errorText}>
          {error}
        </p>
      )}
      {!showError && helpText && (
        <p id={helpId} style={styles.helpText}>
          {helpText}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  useSettingsForm.js  (state + validation hook)                      */
/* ------------------------------------------------------------------ */

function useSettingsForm(defaultValues) {
  const [values, setValues] = useState({
    displayName: defaultValues?.displayName ?? "",
    email: defaultValues?.email ?? "",
    bio: defaultValues?.bio ?? "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setField = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const runFieldValidation = useCallback((field, allValues) => {
    if (field === "confirmPassword") {
      return validateConfirmPassword(allValues.password, allValues.confirmPassword);
    }
    return validators[field] ? validators[field](allValues[field]) : "";
  }, []);

  const validateField = useCallback(
    (field) => {
      setValues((currentValues) => {
        const message = runFieldValidation(field, currentValues);
        setErrors((prev) => ({ ...prev, [field]: message }));

        // If password changes and confirmPassword was already touched,
        // keep the confirm-password error in sync.
        if (field === "password") {
          setTouched((prevTouched) => {
            if (prevTouched.confirmPassword) {
              const confirmMsg = validateConfirmPassword(
                currentValues.password,
                currentValues.confirmPassword
              );
              setErrors((prev) => ({ ...prev, confirmPassword: confirmMsg }));
            }
            return prevTouched;
          });
        }
        return currentValues;
      });
      setTouched((prev) => ({ ...prev, [field]: true }));
    },
    [runFieldValidation]
  );

  const validateAll = useCallback(() => {
    let isValid = true;
    const nextErrors = {};
    const fields = ["displayName", "email", "bio", "password", "confirmPassword"];

    fields.forEach((field) => {
      const message = runFieldValidation(field, values);
      nextErrors[field] = message;
      if (message) isValid = false;
    });

    setErrors(nextErrors);
    setTouched({
      displayName: true,
      email: true,
      bio: true,
      password: true,
      confirmPassword: true,
    });

    return isValid;
  }, [values, runFieldValidation]);

  return { values, errors, touched, setField, validateField, validateAll };
}

/* ------------------------------------------------------------------ */
/*  SettingsForm.jsx  (main exported component)                        */
/* ------------------------------------------------------------------ */

export default function SettingsForm({ defaultValues, onSubmit }) {
  const { values, errors, touched, setField, validateField, validateAll } =
    useSettingsForm(defaultValues);
  const [submitted, setSubmitted] = useState(false);

  const bioLength = values.bio.length;
  const bioNearLimit = bioLength > BIO_MAX_LENGTH - 20;

  const passwordEntered = values.password.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(false);
    const isValid = validateAll();
    if (isValid) {
      setSubmitted(true);
      if (typeof onSubmit === "function") {
        // Never send confirmPassword to a consumer/API.
        const { confirmPassword, ...payload } = values;
        onSubmit(payload);
      }
    }
  };

  const counterStyle = useMemo(
    () => ({ ...styles.counter, ...(bioNearLimit ? styles.counterWarn : {}) }),
    [bioNearLimit]
  );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Profile settings</h2>
        <p style={styles.subheading}>
          Update your account details. Fields marked required must be filled in.
        </p>

        {submitted && (
          <div style={styles.successBanner} role="status">
            Settings saved successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <FormField
            id="displayName"
            label="Display name"
            required
            value={values.displayName}
            onChange={(v) => setField("displayName", v)}
            onBlur={() => validateField("displayName")}
            error={errors.displayName}
            touched={touched.displayName}
            autoComplete="name"
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            required
            value={values.email}
            onChange={(v) => setField("email", v)}
            onBlur={() => validateField("email")}
            error={errors.email}
            touched={touched.email}
            autoComplete="email"
          />

          <FormField
            id="bio"
            label="Bio"
            as="textarea"
            value={values.bio}
            onChange={(v) => setField("bio", v)}
            onBlur={() => validateField("bio")}
            error={errors.bio}
            touched={touched.bio}
            rightSlot={
              <span style={counterStyle}>
                {bioLength}/{BIO_MAX_LENGTH}
              </span>
            }
          />

          <hr style={styles.divider} />
          <p style={styles.sectionLabel}>Change password</p>

          <FormField
            id="password"
            label="New password"
            type="password"
            value={values.password}
            onChange={(v) => setField("password", v)}
            onBlur={() => validateField("password")}
            error={errors.password}
            touched={touched.password}
            autoComplete="new-password"
            helpText="Leave blank to keep your current password."
          />

          <FormField
            id="confirmPassword"
            label="Confirm new password"
            type="password"
            value={values.confirmPassword}
            onChange={(v) => setField("confirmPassword", v)}
            onBlur={() => validateField("confirmPassword")}
            error={errors.confirmPassword}
            touched={touched.confirmPassword}
            disabled={!passwordEntered}
            autoComplete="new-password"
          />

          <button type="submit" style={styles.submitBtn}>
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
}