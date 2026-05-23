"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/authService";
import { getCurrentUser, saveCurrentUser } from "@/utils/storage";

const menuItems = [
  ["Home", "H"],
  ["Profile", "P"],
  ["Groups", "G"],
  ["Services", "S"],
  ["Appointments", "A"],
  ["Friends", "F"],
  ["Messages", "M"],
  ["Events", "E"],
  ["Jobs", "J"],
  ["Pages", "Pg"],
  ["Discussions", "D"],
  ["Store", "St"],
];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = getCurrentUser();
    const token = localStorage.getItem("accessToken");

    if (storedUser) {
      setUser(storedUser);
    }

    if (!token) return;

    const loadUser = async () => {
      try {
        const response = await getMe();
        setUser(response.data.user);
        saveCurrentUser(response.data.user);
      } catch (err) {
        if (err?.response?.status !== 404) {
          console.error("User load error:", err);
        }
      }
    };

    loadUser();
  }, []);

  const firstName = user?.firstName || "User";
  const username = user?.username || "username";
  const initials = firstName.slice(0, 2).toUpperCase();

  return (
    <main className="pets-home-page">
      <nav className="pets-home-navbar">
        <div className="pets-home-nav-inner">
          <div className="pets-home-logo" aria-label="PetsGrin">
            <span className="pets-home-logo-icon">P</span>
            <span>PetsGrin</span>
          </div>

          <label className="pets-home-search">
            <span>Search</span>
            <input type="search" placeholder="Search..." />
            <b>Q</b>
          </label>

          <button className="pets-icon-btn" type="button" aria-label="Notifications">
            !
          </button>

          <button
            className="pets-home-avatar"
            type="button"
            onClick={() => router.push("/profile")}
            aria-label="Open profile"
          >
            {initials}
          </button>
        </div>
      </nav>

      <section className="pets-home-layout">
        <aside className="pets-sidebar">
          <div className="pets-sidebar-scroll">
            {menuItems.map(([label, icon]) => (
              <button
                className={`pets-side-link ${label === "Home" ? "is-active" : ""}`}
                key={label}
                type="button"
                onClick={() => {
                  if (label === "Profile") router.push("/profile");
                }}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}

            <div className="pets-events-box">
              <h2>Events & Invitations</h2>
              <div>No upcoming events</div>
            </div>

            <button
              className="pets-logout-link"
              type="button"
              onClick={() => router.push("/logout")}
            >
              Logout
            </button>
          </div>
        </aside>

        <section className="pets-feed">
          <div className="pets-story">
            <button className="pets-story-avatar" type="button">
              {initials}
              <span>+</span>
            </button>
            <p>Your Story</p>
          </div>

          <article className="pets-composer">
            <div className="pets-composer-card">
              <div className="pets-composer-head">
                <div className="pets-mini-avatar">{initials}</div>
                <div>
                  <h2>{firstName}</h2>
                  <p>@{username}</p>
                </div>

                <button className="pets-visibility" type="button">
                  Public
                </button>
              </div>

              <label className="pets-post-field">
                <span>Create post</span>
                <textarea
                  maxLength={2000}
                  placeholder="Post your pet's highlights! Type @ to tag your pets..."
                />
                <b>0/2000</b>
              </label>

              <div className="pets-composer-actions">
                <div>
                  <button type="button">+</button>
                  <button type="button">I</button>
                  <button type="button">B</button>
                  <button type="button">L</button>
                </div>

                <button className="pets-send-btn" type="button">
                  →
                </button>
              </div>
            </div>
          </article>

          <div className="pets-feed-tabs">
            <button className="is-active" type="button">Friends' Buzz</button>
            <button type="button">Beyond Your Circle</button>
          </div>

          <article className="pets-post-card">
            <div className="pets-post-head">
              <div className="pets-mini-avatar">{initials}</div>
              <div>
                <h2>{firstName}</h2>
                <p>@{username} · 11 days <span>Public</span></p>
              </div>
              <button type="button">...</button>
            </div>

            <h3>poll</h3>
            <div className="pets-poll-row">
              <span></span>
              <p>abcd</p>
              <b>0%</b>
            </div>
          </article>
        </section>

        <aside className="pets-rightbar">
          <section className="pets-bookings">
            <h2>Bookings</h2>
            <div className="pets-booking-tabs">
              <button className="is-active" type="button">Upcoming</button>
              <button type="button">In Progress</button>
              <button type="button">Pending</button>
            </div>
            <p>No upcoming bookings found.</p>
          </section>
        </aside>
      </section>
    </main>
  );
}
