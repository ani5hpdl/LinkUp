import api from "./axios";

const unwrapUser = (response) => response?.data?.data ?? response?.data ?? null;

export const loginUser = async (data) => {
  const response = await api.post("/auth/login", data);
  return unwrapUser(response);
};

export const registerUser = async (data) => {
  const response = await api.post("/auth/register", data);
  return unwrapUser(response);
};

export const logOut = async () => {
  const response = await api.post("/auth/logout");
  return response?.data ?? null;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return unwrapUser(response);
};

export const updateMe = async (data) => {
  const response = await api.put("/auth/me", data);
  const user = unwrapUser(response);
  if (!user) return null;
  const { password: _password, ...safeUser } = user;
  return safeUser;
};
