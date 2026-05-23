"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithCode, resendCode } from "@/services/authService";
import { saveTokens } from "@/utils/storage";

const OTP_SEND_COOLDOWN_MS = 30000;
const OTP_SEND_KEY = "loginCodeLastSent";

export default function LoginCodePage() {
  const router = useRouter();
  const hasSentCode = useRef(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (hasSentCode.current) {
      return;
    }

    const storedEmail = localStorage.getItem("email") || "";
    setEmail(storedEmail);

    if (!storedEmail) {
      router.push("/");
      return;
    }

    const lastSent = JSON.parse(sessionStorage.getItem(OTP_SEND_KEY) || "null");

    if (
      lastSent?.email === storedEmail &&
      Date.now() - lastSent.sentAt < OTP_SEND_COOLDOWN_MS
    ) {
      hasSentCode.current = true;
      return;
    }

    hasSentCode.current = true;
    sessionStorage.setItem(
      OTP_SEND_KEY,
      JSON.stringify({ email: storedEmail, sentAt: Date.now() })
    );

    const sendCode = async () => {
      try {
        setSending(true);
        await resendCode(storedEmail);
      } catch (err) {
        sessionStorage.removeItem(OTP_SEND_KEY);
        console.error(err);
        alert("Unable to send OTP");
      } finally {
        setSending(false);
      }
    };

    sendCode();
  }, [router]);

  const handleVerify = async () => {
    if (code.length !== 4) {
      alert("Enter 4 digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await loginWithCode({
        email: email.trim().toLowerCase(),
        code,
      });

      if (response.data.status === 200) {
        saveTokens(response.data.tokens);
        router.push("/home");
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "OTP login failed");
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
            <h1>Login Code</h1>
            <p>A fresh one-time code is sent to your email when this screen opens.</p>
          </div>

          <div className="social-row" aria-label="Social platforms">
            <span className="social-chip">Instagram</span>
            <span className="social-chip">Facebook</span>
            <span className="social-chip">LinkedIn</span>
          </div>
        </aside>

        <div className="auth-form">
          <h1>Verify Code</h1>
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
            <button className="btn btn-primary btn-full" onClick={handleVerify} disabled={loading || sending}>
              {loading ? "Verifying..." : sending ? "Sending..." : "Verify"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
