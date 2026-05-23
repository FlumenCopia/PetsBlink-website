"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  checkEmail,
  loginUser,
  loginWithCode,
  resendCode,
} from "@/services/authService";
import { saveCurrentUser, saveTokens } from "@/utils/storage";

const emptyCode = ["", "", "", ""];

export default function Page() {
  const router = useRouter();
  const codeInputRefs = useRef([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codeDigits, setCodeDigits] = useState(emptyCode);
  const [mode, setMode] = useState("email");
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const cleanEmail = email.trim().toLowerCase();
  const code = codeDigits.join("");

  const continueHandler = async () => {
    if (!cleanEmail) {
      alert("Enter email");
      return;
    }

    try {
      setLoading(true);
      const res = await checkEmail(cleanEmail);

      localStorage.setItem("email", cleanEmail);

      if (res.data.exists) {
        setMode("password");
      } else {
        router.push(`/register?email=${encodeURIComponent(cleanEmail)}`);
      }
    } catch (err) {
      console.error("Check email error:", err);
      alert(err?.response?.data?.message || "Unable to check email");
    } finally {
      setLoading(false);
    }
  };

  const loginCodeHandler = async () => {
    if (!cleanEmail) {
      alert("Enter email");
      return;
    }

    try {
      setSendingCode(true);
      const res = await checkEmail(cleanEmail);

      localStorage.setItem("email", cleanEmail);

      if (res.data.exists) {
        await resendCode(cleanEmail);
        setCodeDigits(emptyCode);
        setMode("code");
        setTimeout(() => codeInputRefs.current[0]?.focus(), 0);
      } else {
        router.push(`/register?email=${encodeURIComponent(cleanEmail)}`);
      }
    } catch (err) {
      console.error("Check email error:", err);
      alert(err?.response?.data?.message || "Unable to check email");
    } finally {
      setSendingCode(false);
    }
  };

  const passwordLoginHandler = async () => {
    if (!password) {
      alert("Enter password");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser({
        email: cleanEmail,
        password,
      });

      if (response.data.status === 200) {
        saveTokens(response.data.tokens);
        saveCurrentUser(response.data.user);
        router.push("/home");
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyCodeHandler = async () => {
    if (code.length !== 4) {
      alert("Enter 4 digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await loginWithCode({
        email: cleanEmail,
        code,
      });

      if (response.data.status === 200) {
        saveTokens(response.data.tokens);
        saveCurrentUser(response.data.user);
        router.push("/home");
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "OTP login failed");
    } finally {
      setLoading(false);
    }
  };

  const updateCodeDigit = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    setCodeDigits((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? digit : item
      )
    );

    if (digit && index < codeInputRefs.current.length - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index, event) => {
    if (event.key === "Backspace" && !codeDigits[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (event) => {
    const pastedCode = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (pastedCode.length !== 4) return;

    event.preventDefault();
    setCodeDigits(pastedCode.split(""));
    codeInputRefs.current[3]?.focus();
  };

  const resetToEmail = () => {
    setMode("email");
    setPassword("");
    setCodeDigits(emptyCode);
  };

  return (
    <main className="pets-login-page">
      <nav className="pets-navbar">
        <div className="pets-nav-inner">
          <div className="pets-logo" aria-label="PetsGrin">
            <span className="pets-logo-icon">P</span>
            <span>PetsGrin</span>
          </div>

          <div className="pets-links" aria-label="Primary navigation">
            <a href="#">Home</a>
            <a href="#">Pet Tips</a>
            <a href="#">Community Benefits</a>
            <a href="#">About Us</a>
            <a href="#">Contact Us</a>
          </div>

          <button className="pets-login-pill" type="button">
            Log In
          </button>
        </div>
      </nav>

      <section className="pets-login-section">
        <div className="pets-login-image">
          <img
            src="https://images.unsplash.com/photo-1688597168968-d5ae4127a2ca?auto=format&fit=crop&w=900&q=85"
            alt="Woman relaxing at home with a dog"
          />
        </div>

        {mode === "email" && (
          <div className="pets-login-form">
            <h1>Log in and join the fun!</h1>

            <label className="pets-email-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <button
              className="pets-primary-btn"
              onClick={continueHandler}
              disabled={loading || sendingCode}
            >
              {loading ? "Checking..." : "Continue"}
            </button>

            <button
              className="pets-outline-btn"
              onClick={loginCodeHandler}
              disabled={loading || sendingCode}
            >
              {sendingCode ? "Sending..." : "Login with Code"}
            </button>
          </div>
        )}

        {mode === "password" && (
          <div className="pets-login-form">
            <h1>Enter your password</h1>
            <p className="pets-helper-text">
              Continue with <strong>{cleanEmail}</strong>
            </p>

            <label className="pets-email-field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button
              className="pets-primary-btn"
              onClick={passwordLoginHandler}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Continue"}
            </button>

            <button
              className="pets-text-btn"
              type="button"
              onClick={resetToEmail}
            >
              Use another email
            </button>
          </div>
        )}

        {mode === "code" && (
          <div className="pets-login-form pets-code-form">
            <h1>Verify your email</h1>
            <p className="pets-code-copy">
              We have sent you a login code to
              <strong>{cleanEmail}</strong>
            </p>

            <div className="pets-code-inputs" onPaste={handleCodePaste}>
              {codeDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    codeInputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => updateCodeDigit(index, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(index, e)}
                  aria-label={`Code digit ${index + 1}`}
                />
              ))}
            </div>

            <button
              className="pets-primary-btn"
              onClick={verifyCodeHandler}
              disabled={loading || code.length !== 4}
            >
              {loading ? "Verifying..." : "Continue"}
            </button>

            <button
              className="pets-text-btn"
              type="button"
              onClick={loginCodeHandler}
              disabled={sendingCode}
            >
              {sendingCode ? "Sending..." : "Resend Login code"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
