import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsForm, {
  validateEmail,
  validateConfirmPassword,
} from "./SettingsForm";

/* ------------------------------------------------------------------ */
/*  1. Pure unit tests for the validation functions                    */
/* ------------------------------------------------------------------ */

describe("validateEmail", () => {
  it("accepts a standard, well-formed email", () => {
    expect(validateEmail("jane.doe@example.com")).toBe("");
  });

  it("accepts emails with subdomains and plus-addressing", () => {
    expect(validateEmail("jane+newsletter@mail.example.co.uk")).toBe("");
  });

  it("rejects an empty value as required", () => {
    expect(validateEmail("")).toMatch(/required/i);
  });

  it("rejects a value missing the @ symbol", () => {
    expect(validateEmail("janeexample.com")).toMatch(/valid email/i);
  });

  it("rejects a value with no domain", () => {
    expect(validateEmail("jane@")).toMatch(/valid email/i);
  });

  it("rejects a value with consecutive dots in the local part", () => {
    expect(validateEmail("jane..doe@example.com")).toMatch(/valid email/i);
  });

  it("rejects a value containing spaces", () => {
    expect(validateEmail("jane doe@example.com")).toMatch(/valid email/i);
  });
});

describe("validateConfirmPassword", () => {
  it("returns no error when no new password was entered", () => {
    expect(validateConfirmPassword("", "")).toBe("");
  });

  it("requires confirmation once a new password is entered", () => {
    expect(validateConfirmPassword("Abcdef12", "")).toMatch(/confirm/i);
  });

  it("returns an error when passwords do not match", () => {
    expect(validateConfirmPassword("Abcdef12", "Abcdef13")).toMatch(/do not match/i);
  });

  it("returns no error when passwords match exactly", () => {
    expect(validateConfirmPassword("Abcdef12", "Abcdef12")).toBe("");
  });
});

/* ------------------------------------------------------------------ */
/*  2. Integration tests through the rendered component                */
/* ------------------------------------------------------------------ */

const baseDefaults = {
  displayName: "Jane Doe",
  email: "jane@example.com",
  bio: "Product designer.",
};

describe("SettingsForm — email field", () => {
  it("does not show an error while the user is still typing", () => {
    render(<SettingsForm defaultValues={baseDefaults} />);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(emailInput, { target: { value: "not-an-email" } });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows a validation error on blur when the email is malformed", () => {
    render(<SettingsForm defaultValues={baseDefaults} />);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(emailInput, { target: { value: "not-an-email" } });
    fireEvent.blur(emailInput);

    expect(screen.getByRole("alert")).toHaveTextContent(/valid email/i);
    expect(emailInput).toHaveAttribute("aria-invalid", "true");
  });

  it("clears the error on blur once a valid email is entered", () => {
    render(<SettingsForm defaultValues={baseDefaults} />);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(emailInput, { target: { value: "bad" } });
    fireEvent.blur(emailInput);
    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: "good@example.com" } });
    fireEvent.blur(emailInput);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(emailInput).toHaveAttribute("aria-invalid", "false");
  });
});

describe("SettingsForm — confirm password field", () => {
  it("is disabled until a new password is entered", () => {
    render(<SettingsForm defaultValues={baseDefaults} />);
    const confirmInput = screen.getByLabelText(/confirm new password/i);
    expect(confirmInput).toBeDisabled();
  });

  it("becomes enabled once a new password is typed", () => {
    render(<SettingsForm defaultValues={baseDefaults} />);
    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmInput = screen.getByLabelText(/confirm new password/i);

    fireEvent.change(passwordInput, { target: { value: "Abcdef12" } });

    expect(confirmInput).toBeEnabled();
  });

  it("flags a mismatch on blur", () => {
    render(<SettingsForm defaultValues={baseDefaults} />);
    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmInput = screen.getByLabelText(/confirm new password/i);

    fireEvent.change(passwordInput, { target: { value: "Abcdef12" } });
    fireEvent.blur(passwordInput);
    fireEvent.change(confirmInput, { target: { value: "Abcdef13" } });
    fireEvent.blur(confirmInput);

    expect(screen.getByText(/do not match/i)).toBeInTheDocument();
  });

  it("passes validation when both password fields match on submit", () => {
    const handleSubmit = jest.fn();
    render(<SettingsForm defaultValues={baseDefaults} onSubmit={handleSubmit} />);

    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmInput = screen.getByLabelText(/confirm new password/i);

    fireEvent.change(passwordInput, { target: { value: "Abcdef12" } });
    fireEvent.change(confirmInput, { target: { value: "Abcdef12" } });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    // confirmPassword must never be forwarded to the submit handler
    expect(handleSubmit.mock.calls[0][0]).not.toHaveProperty("confirmPassword");
  });

  it("blocks submit and surfaces the error if passwords mismatch, even without prior blur", () => {
    const handleSubmit = jest.fn();
    render(<SettingsForm defaultValues={baseDefaults} onSubmit={handleSubmit} />);

    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmInput = screen.getByLabelText(/confirm new password/i);

    fireEvent.change(passwordInput, { target: { value: "Abcdef12" } });
    fireEvent.change(confirmInput, { target: { value: "somethingElse1" } });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/do not match/i)).toBeInTheDocument();
  });
});