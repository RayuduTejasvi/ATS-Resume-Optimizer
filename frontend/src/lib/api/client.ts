const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type ApiOptions = RequestInit & { token?: string | null };

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const token = data.data?.accessToken;
    if (token) localStorage.setItem("cf_access_token", token);
    return token || null;
  } catch {
    return null;
  }
}

export async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { token = localStorage.getItem("cf_access_token"), ...init } = options;

  const headers: HeadersInit = {
    ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let res = await fetch(`${API_BASE}${endpoint}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      res = await fetch(`${API_BASE}${endpoint}`, {
        ...init,
        headers: { ...headers, Authorization: `Bearer ${newToken}` },
        credentials: "include",
      });
    }
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.message || "Request failed", res.status);
  }

  return data as T;
}

export { API_BASE, ApiError };
