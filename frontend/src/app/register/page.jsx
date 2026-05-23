"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { checkUsername } from "@/services/authService";
import { saveRegisterData } from "@/utils/storage";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const handleContinue = async () => {
    if (!email) {
      router.push("/");
      return;
    }

    if (!firstName.trim()) {
      alert("Enter first name");
      return;
    }

    if (!lastName.trim()) {
      alert("Enter last name");
      return;
    }

    if (!username.trim()) {
      alert("Enter username");
      return;
    }

    try {
      setLoading(true);
      const cleanUsername = username.trim();
      const response = await checkUsername(cleanUsername);

      if (response.data.exists) {
        setUsernameError("Username already exists");
        return;
      }

      saveRegisterData({
        email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: cleanUsername,
      });

      router.push("/set-password");
    } catch (err) {
      console.error(err);
      alert("Unable to validate username");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <aside className="auth-brand">
          <div className="brand-mark">
            <span className="brand-logo">A</span>
            Auth Social
          </div>

          <div className="brand-copy">
            <h1>Create Account</h1>
            <p>Build your login and connect your public profile details next.</p>
          </div>

          <div className="social-row" aria-label="Social platforms">
            <span className="social-chip">Instagram</span>
            <span className="social-chip">Facebook</span>
            <span className="social-chip">LinkedIn</span>
          </div>
        </aside>

        <div className="auth-form">
          <h1>Register</h1>
          <p className="email-pill">{email}</p>

          <div className="form-stack">
            <label className="field">
              First name
              <input
                type="text"
                value={firstName}
                placeholder="First name"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>

            <label className="field">
              Last name
              <input
                type="text"
                value={lastName}
                placeholder="Last name"
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>

            <label className="field">
              Username
              <input
                type="text"
                value={username}
                placeholder="Choose a username"
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError("");
                }}
              />
            </label>

            {usernameError && <p className="error-text">{usernameError}</p>}

            <label className="field">
              Email
              <input type="email" value={email} readOnly />
            </label>
          </div>

          <div className="button-row">
            <button className="btn btn-primary btn-full" onClick={handleContinue} disabled={loading}>
              {loading ? "Checking..." : "Continue"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
