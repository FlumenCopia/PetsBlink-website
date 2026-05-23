"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/authService";
import { getRegisterData } from "@/utils/storage";

export default function SetPasswordPage() {
  const router = useRouter();
  const [registerData, setRegisterData] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = getRegisterData();

    if (!data) {
      router.push("/");
      return;
    }

    setRegisterData(data);
  }, [router]);

  const handleContinue = async () => {
    if (!password) {
      alert("Enter password");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await registerUser({
        email: registerData.email,
        username: registerData.username,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        password,
      });

      router.push("/verify-email");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!registerData) {
    return null;
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <aside className="auth-brand">
          <div className="brand-mark">
            <span className="brand-logo">A</span>
            Auth Social
          </div>

          <div className="brand-copy">
            <h1>Set Password</h1>
            <p>Protect your account before email verification.</p>
          </div>

          <div className="social-row" aria-label="Social platforms">
            <span className="social-chip">Instagram</span>
            <span className="social-chip">Facebook</span>
            <span className="social-chip">LinkedIn</span>
          </div>
        </aside>

        <div className="auth-form">
          <h1>New Password</h1>
          <p className="email-pill">{registerData.email}</p>

          <div className="form-stack">
            <label className="field">
              Password
              <input
                type="password"
                value={password}
                placeholder="At least 6 characters"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <label className="field">
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                placeholder="Repeat password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
          </div>

          <div className="button-row">
            <button className="btn btn-primary btn-full" onClick={handleContinue} disabled={loading}>
              {loading ? "Creating Account..." : "Continue"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
