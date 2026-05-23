import axios from "axios";

const API = axios.create({
  baseURL: "/api/profile",
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

export const getMyProfile = async () => {
  return API.get("/me");
};

export const saveMyProfile = async (formData) => {
  return API.post("/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
