export const saveRegisterData = (data) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    "registerData",
    JSON.stringify(data)
  );
};

export const getRegisterData = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const data = localStorage.getItem("registerData");

  try {
    return data ? JSON.parse(data) : null;
  } catch {
    localStorage.removeItem("registerData");
    return null;
  }
};

export const clearRegisterData = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("registerData");
};

export const saveTokens = (tokens) => {
  if (
    typeof window === "undefined" ||
    !tokens?.accessToken ||
    !tokens?.refreshToken
  ) {
    return;
  }

  localStorage.setItem(
    "accessToken",
    tokens.accessToken
  );

  localStorage.setItem(
    "refreshToken",
    tokens.refreshToken
  );
};

export const saveCurrentUser = (user) => {
  if (typeof window === "undefined" || !user) {
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const getCurrentUser = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const data = localStorage.getItem("currentUser");

  try {
    return data ? JSON.parse(data) : null;
  } catch {
    localStorage.removeItem("currentUser");
    return null;
  }
};

export const logout = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("email");
  localStorage.removeItem("currentUser");
};
