"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/authService";
import { logout } from "@/utils/storage";

export default function LogoutPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Logging out...");

  useEffect(() => {
    const handleLogout = async () => {
      logout();

      try {
        const response = await logoutUser();
        setMessage(response.data?.message || "Logged out successfully");
      } catch (err) {
        console.error("Logout error:", err);
        setMessage("Logged out locally");
      } finally {
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    };

    handleLogout();
  }, [router]);

  return (
    <main className="center-shell">
      <section className="status-card">
        <div className="brand-mark">
          <span className="brand-logo">A</span>
          Auth Social
        </div>
        <h1>Logout</h1>
        <p>{message}</p>
      </section>
    </main>
  );
}
