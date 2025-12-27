const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/$/, "");
const CACHE_PREFIX = "anime_cache:";
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;

const getToken = () => {
  return localStorage.getItem("anime_token") || import.meta.env.VITE_API_TOKEN || "";
};
const persistToken = (token) => {
  if (token) {
    localStorage.setItem("anime_token", token);
  } else {
    localStorage.removeItem("anime_token");
  }
};

const readCache = (key) => {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.expiresAt !== "number") return null;
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
};

const writeCache = (key, data, ttlMs) => {
  try {
    localStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ data, expiresAt: Date.now() + ttlMs })
    );
  } catch {
    // Ignore cache write failures (quota, private mode, etc).
  }
};

async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const isFormData = options.body instanceof FormData;
  const headers = {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = response.status === 204 ? null : isJson ? await response.json() : await response.text();

  if (!response.ok) {
    let message = isJson && data?.message ? data.message : response.statusText;
    if (isJson && data?.errors) {
      const firstError = Object.values(data.errors).flat()[0];
      if (firstError) message = firstError;
    }
    throw new Error(message || "Request failed");
  }

  return data;
}

async function cachedRequest(path, options = {}, ttlMs = DEFAULT_CACHE_TTL_MS) {
  const method = (options.method || "GET").toUpperCase();
  if (method !== "GET") {
    return request(path, options);
  }

  const cacheKey = options.cacheKey || path;
  const cached = readCache(cacheKey);
  if (cached !== null) {
    return cached;
  }

  const data = await request(path, options);
  writeCache(cacheKey, data, ttlMs);
  return data;
}

const clearCache = (predicate) => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (!key.startsWith(CACHE_PREFIX)) return;
      const cacheKey = key.slice(CACHE_PREFIX.length);
      if (predicate(cacheKey)) {
        localStorage.removeItem(key);
      }
    });
  } catch {
    // Ignore cache read issues.
  }
};

export const getCurrentUser = () => request("/user");
export const getAnimes = (params = {}) => {
  const query = new URLSearchParams(params);
  const path = `/anime?${query.toString()}`;
  return cachedRequest(path, {}, 2 * 60 * 1000);
};

export const getAnime = (id) => cachedRequest(`/anime/${id}`, {}, 5 * 60 * 1000);
export const getEpisodes = (id, params = {}) => {
  const query = new URLSearchParams(params);
  const path = `/anime/${id}/episodes?${query.toString()}`;
  return cachedRequest(path, {}, 2 * 60 * 1000);
};

export const getComments = (id, params = {}) => {
  const query = new URLSearchParams(params);
  const path = `/anime/${id}/comments?${query.toString()}`;
  return cachedRequest(path, {}, 30 * 1000);
};
export const postComment = (id, body) =>
  request(`/anime/${id}/comments`, { method: "POST", body: JSON.stringify({ body }) });

export const toggleFavorite = (id) => request(`/anime/${id}/favorite`, { method: "POST" });
export const toggleWatchlist = (id) => request(`/anime/${id}/watchlist`, { method: "POST" });
export const markWatched = (id, payload) =>
  request(`/anime/${id}/watched`, { method: "POST", body: JSON.stringify(payload || {}) });
export const rateAnime = (id, score) =>
  request(`/anime/${id}/rate`, { method: "POST", body: JSON.stringify({ score }) });

export const loginForToken = (email, password) =>
  request("/auth/token", { method: "POST", body: JSON.stringify({ email, password }) });
export const registerUser = (payload) =>
  request("/auth/register", { method: "POST", body: JSON.stringify(payload) });
export const logoutUser = () => request("/auth/logout", { method: "POST" });
export const saveToken = persistToken;

// User library
export const getFavorites = () => request("/me/favorites");
export const getWatchlist = () => request("/me/watchlist");
export const getHistory = () => request("/me/history");

// Genres & studios
export const getGenres = () => cachedRequest("/genres", {}, 10 * 60 * 1000);
export const getStudios = () => cachedRequest("/studios", {}, 10 * 60 * 1000);
export const createGenre = (payload) =>
  request("/genres", { method: "POST", body: JSON.stringify(payload) }).then((data) => {
    clearCache((key) => key.startsWith("/genres"));
    return data;
  });
export const createStudio = (payload) =>
  request("/studios", { method: "POST", body: JSON.stringify(payload) }).then((data) => {
    clearCache((key) => key.startsWith("/studios"));
    return data;
  });

// Admin helpers
export const createAnime = (payload) =>
  request("/anime", { method: "POST", body: JSON.stringify(payload) }).then((data) => {
    clearCache((key) => key.startsWith("/anime"));
    return data;
  });
export const updateAnime = (id, payload) =>
  request(`/anime/${id}`, { method: "PATCH", body: JSON.stringify(payload) }).then((data) => {
    clearCache((key) => key.startsWith("/anime"));
    return data;
  });
export const createEpisode = (id, payload) =>
  request(`/anime/${id}/episodes`, { method: "POST", body: JSON.stringify(payload) }).then((data) => {
    clearCache((key) => key.startsWith(`/anime/${id}`));
    return data;
  });
export const uploadProfileMedia = (formData) =>
  request(`/user/media`, { method: "POST", body: formData });
