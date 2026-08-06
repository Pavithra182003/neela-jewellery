import api from "./api";

const ACCESS_TOKEN_KEY = "access";
const REFRESH_TOKEN_KEY = "refresh";

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  set: (access, refresh) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// Attach the access token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401, try exactly once to refresh the access token and replay
// the original request before giving up and forcing a logout.
let isRefreshing = false;
let queue = [];

const flushQueue = (error, token = null) => {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  queue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refresh = tokenStorage.getRefresh();
    if (!refresh) {
      tokenStorage.clear();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await api.post("/auth/token/refresh/", { refresh });
      tokenStorage.set(data.access, refresh);
      flushQueue(null, data.access);
      originalRequest.headers.Authorization = `Bearer ${data.access}`;
      return api(originalRequest);
    } catch (refreshError) {
      flushQueue(refreshError);
      tokenStorage.clear();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// ---- Auth API calls ----

export const authService = {
  register: (payload) => api.post("/auth/register/", payload).then((res) => res.data),

  login: (email, password) =>
    api.post("/auth/login/", { email, password }).then((res) => res.data),

  logout: () => {
    const refresh = tokenStorage.getRefresh();
    return api.post("/auth/logout/", { refresh }).finally(() => tokenStorage.clear());
  },

  me: () => api.get("/auth/me/").then((res) => res.data),

  updateMe: (payload) => api.patch("/auth/me/", payload).then((res) => res.data),

  forgotPassword: (email) =>
    api.post("/auth/forgot-password/", { email }).then((res) => res.data),

  resetPassword: (uid, token, newPassword, newPassword2) =>
    api
      .post("/auth/reset-password/", {
        uid,
        token,
        new_password: newPassword,
        new_password2: newPassword2,
      })
      .then((res) => res.data),

  changePassword: (oldPassword, newPassword, newPassword2) =>
    api
      .post("/auth/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
        new_password2: newPassword2,
      })
      .then((res) => res.data),
};
