import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: `${apiBaseUrl}/auth`,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const checkEmail = async (email) => {
  return API.get(`/check-email/${encodeURIComponent(email.trim().toLowerCase())}`);
};

export const checkUsername = async (username) => {
  return API.get(`/check-username/${encodeURIComponent(username.trim())}`);
};

export const getMe = async () => {
  return API.get("/me");
};

export const registerUser = async (data) => {
  return API.post("/register", data);
};

export const loginUser = async (data) => {
  return API.post("/login", data);
};

export const loginWithCode = async (data) => {
  return API.post("/login-with-code", data);
};

export const logoutUser = async () => {
  return API.post("/logout");
};

export const verifyEmail = async (data) => {
  return API.post("/verify-email", data);
};

export const resendCode = async (email) => {
  return API.post("/resend-code", { email });
};
