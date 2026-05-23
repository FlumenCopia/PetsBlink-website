"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyEmail, resendCode } from "@/services/authService";
import {
  clearRegisterData,
  getRegisterData,
  saveCurrentUser,
  saveTokens,
} from "@/utils/storage";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const data = getRegisterData();

    if (!data) {
      router.push("/");
      return;
    }

    setEmail(data.email);
  }, [router]);

  const handleVerify = async () => {
    if (code.length !== 4) {
      alert("Enter 4 digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyEmail({
        email,
        code,
      });

      if (response.data.status === 200) {
        const registerData = getRegisterData();

        saveTokens(response.data.tokens);
        saveCurrentUser(
          response.data.user || {
            email,
            firstName: registerData?.firstName,
            lastName: registerData?.lastName,
            username: registerData?.username,
          }
        );
        clearRegisterData();
        localStorage.setItem("email", email);
        alert("Email verified successfully");
        router.push("/home");
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);

      if (!email) {
        router.push("/");
        return;
      }

      await resendCode(email);
      alert("OTP resent successfully");
    } catch (err) {
      console.error(err);
      alert("Unable to resend OTP");
    } finally {
      setResending(false);
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
            <h1>Verify Email</h1>
            <p>Enter the code sent to your email to activate your account.</p>
          </div>

          <div className="social-row" aria-label="Social platforms">
            <span className="social-chip">Instagram</span>
            <span className="social-chip">Facebook</span>
            <span className="social-chip">LinkedIn</span>
          </div>
        </aside>

        <div className="auth-form">
          <h1>Email Code</h1>
          <p className="email-pill">{email}</p>

          <div className="form-stack">
            <label className="field">
              Code
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={code}
                placeholder="0000"
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
            </label>
          </div>

          <div className="button-row">
            <button className="btn btn-primary" onClick={handleVerify} disabled={loading}>
              {loading ? "Verifying..." : "Verify"}
            </button>

            <button className="btn btn-secondary" onClick={handleResend} disabled={resending}>
              {resending ? "Sending..." : "Resend OTP"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
