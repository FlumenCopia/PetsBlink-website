"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/authService";
import { getMyProfile } from "@/services/profileService";
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

const initialAbout = {
  companyName: "",
  tagline: "",
  about: "",
  servicesOffered: "",
  specializations: "",
  industriesServed: "",
  serviceLocations: "",
  businessEmail: "",
  mobileNumber: "",
  website: "",
  addressLine1: "",
  brandHashtags: "",
  locationName: "",
  latitude: "",
  longitude: "",
};

const toCsv = (value) =>
  Array.isArray(value) ? value.join(", ") : value || "";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aboutForm, setAboutForm] = useState(initialAbout);

  useEffect(() => {
    const storedUser = getCurrentUser();
    const token = localStorage.getItem("accessToken");

    if (storedUser) {
      setUser(storedUser);
    }

    if (!token) {
      return;
    }

    const loadProfileData = async () => {
      try {
        const userResponse = await getMe();
        setUser(userResponse.data.user);
        saveCurrentUser(userResponse.data.user);
      } catch (err) {
        if (err?.response?.status !== 404) {
          console.error("User load error:", err);
        }
      }

      try {
        const profileResponse = await getMyProfile();
        const profile = profileResponse.data.profile;

        if (!profile) return;

        setAboutForm({
          companyName: profile.companyName || "",
          tagline: profile.tagline || "",
          about: profile.about || "",
          servicesOffered: toCsv(profile.servicesOffered),
          specializations: toCsv(profile.specializations),
          industriesServed: toCsv(profile.industriesServed),
          serviceLocations: profile.serviceLocations || "",
          businessEmail: profile.businessEmail || "",
          mobileNumber: profile.mobileNumber || "",
          website: profile.website || "",
          addressLine1: profile.addressLine1 || "",
          brandHashtags: toCsv(profile.brandHashtags),
          locationName: profile.locationName || "",
          latitude: profile.latitude || "",
          longitude: profile.longitude || "",
        });
      } catch (err) {
        if (
          err?.response?.status !== 401 &&
          err?.response?.status !== 404
        ) {
          console.error("Profile load error:", err);
        }
      }
    };

    loadProfileData();
  }, []);

  const firstName = user?.firstName || "User";
  const username = user?.username || "username";
  const initials = firstName.slice(0, 2).toUpperCase();

  const updateAboutField = (field, value) => {
    setAboutForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

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

          <button className="pets-home-avatar" type="button" aria-label="Profile">
            {initials}
          </button>
        </div>
      </nav>

      <section className="pets-home-layout">
        <aside className="pets-sidebar">
          <div className="pets-sidebar-scroll">
            {menuItems.map(([label, icon]) => (
              <button
                className={`pets-side-link ${label === "Profile" ? "is-active" : ""}`}
                key={label}
                type="button"
                onClick={() => {
                  if (label === "Home") router.push("/home");
                  if (label === "Profile") router.push("/profile");
                }}
              >
                <span>{icon}</span>
                {label}
              </button>
            ))}

            <button
              className="pets-logout-link"
              type="button"
              onClick={() => router.push("/logout")}
            >
              Logout
            </button>
          </div>
        </aside>

        <section className="pets-feed pets-profile-feed">
          <article className="pets-profile-card">
            <button className="pets-profile-edit" type="button">
              Edit
            </button>

            <div className="pets-profile-main">
              <div className="pets-profile-avatar">{initials}</div>
              <div>
                <h1>{firstName} <span>*</span></h1>
                <p>@{username}</p>
              </div>
            </div>

            <div className="pets-profile-friends">
              <span>+</span>
              <b>1 Friends</b>
            </div>

            <hr />

            <p className="pets-profile-bio">
              {aboutForm.about || "Add your profile details in About."}
            </p>

            <button
              className="pets-about-chip"
              type="button"
              onClick={() => setAboutOpen((current) => !current)}
            >
              About <span>{aboutOpen ? "^" : "v"}</span>
            </button>

            {aboutOpen && (
              <div className="pets-about-panel">
                <label>
                  Company Name
                  <input
                    value={aboutForm.companyName}
                    onChange={(e) => updateAboutField("companyName", e.target.value)}
                  />
                </label>

                <label>
                  Tagline
                  <input
                    value={aboutForm.tagline}
                    onChange={(e) => updateAboutField("tagline", e.target.value)}
                  />
                </label>

                <label className="pets-about-wide">
                  About / Bio
                  <textarea
                    value={aboutForm.about}
                    onChange={(e) => updateAboutField("about", e.target.value)}
                  />
                </label>

                <label>
                  Services Offered
                  <input
                    value={aboutForm.servicesOffered}
                    onChange={(e) => updateAboutField("servicesOffered", e.target.value)}
                  />
                </label>

                <label>
                  Specializations
                  <input
                    value={aboutForm.specializations}
                    onChange={(e) => updateAboutField("specializations", e.target.value)}
                  />
                </label>

                <label>
                  Industries Served
                  <input
                    value={aboutForm.industriesServed}
                    onChange={(e) => updateAboutField("industriesServed", e.target.value)}
                  />
                </label>

                <label>
                  Service Locations
                  <input
                    value={aboutForm.serviceLocations}
                    onChange={(e) => updateAboutField("serviceLocations", e.target.value)}
                  />
                </label>

                <label>
                  Business Email
                  <input
                    type="email"
                    value={aboutForm.businessEmail}
                    onChange={(e) => updateAboutField("businessEmail", e.target.value)}
                  />
                </label>

                <label>
                  Mobile Number
                  <input
                    value={aboutForm.mobileNumber}
                    onChange={(e) => updateAboutField("mobileNumber", e.target.value)}
                  />
                </label>

                <label>
                  Website
                  <input
                    value={aboutForm.website}
                    onChange={(e) => updateAboutField("website", e.target.value)}
                  />
                </label>

                <label>
                  Address
                  <input
                    value={aboutForm.addressLine1}
                    onChange={(e) => updateAboutField("addressLine1", e.target.value)}
                  />
                </label>

                <label>
                  Location Name
                  <input
                    value={aboutForm.locationName}
                    onChange={(e) => updateAboutField("locationName", e.target.value)}
                  />
                </label>

                <label>
                  Latitude
                  <input
                    value={aboutForm.latitude}
                    onChange={(e) => updateAboutField("latitude", e.target.value)}
                  />
                </label>

                <label>
                  Longitude
                  <input
                    value={aboutForm.longitude}
                    onChange={(e) => updateAboutField("longitude", e.target.value)}
                  />
                </label>

                <label className="pets-about-wide">
                  Brand Hashtags
                  <input
                    value={aboutForm.brandHashtags}
                    onChange={(e) => updateAboutField("brandHashtags", e.target.value)}
                  />
                </label>
              </div>
            )}
          </article>

          <section className="pets-pets-section">
            <div className="pets-section-head">
              <h2>My Pets</h2>
              <button type="button">+ Add Pet</button>
            </div>

            <article className="pets-pet-card">
              <img
                src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=240&q=80"
                alt="Pet"
              />
              <div>
                <h3>ssss</h3>
                <p>Labrador Retriever - 7 months</p>
                <span>iuytdrdfguhukgjfhxghkvm</span>
              </div>
              <b>i</b>
            </article>
          </section>

          <section className="pets-media-tabs">
            <button className="is-active" type="button">Photos</button>
            <button type="button">Videos</button>
            <button type="button">Documents</button>
          </section>
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
