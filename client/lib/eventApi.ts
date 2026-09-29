const API_URL = "http://localhost:5000/api/events";

const authHeaders = () => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("eventsphere-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createEvent = async (eventData: any) => {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },

    body: JSON.stringify(eventData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const getAllEvents = async () => {
  const response = await fetch(API_URL);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch events");
  }

  return data;
};

export const getSingleEvent = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch event");
  }

  return data;
};

export const registerForEvent = async (
  id: string,
  registrationData: {
    ticketName: string;
    quantity: number;
  }
) => {
  const response = await fetch(
    `http://localhost:5000/api/events/${id}/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(registrationData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Registration failed"
    );
  }

  return data;
};

const request = async (path: string, options?: RequestInit) => {
  const response = await fetch(`http://localhost:5000/api/events${path}`, { ...options, headers: { ...authHeaders(), ...(options?.headers || {}) } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const createCheckout = (id: string, body: unknown) =>
  request(`/${id}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const completeCheckout = (id: string, body: unknown) =>
  request(`/${id}/checkout/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const getDashboard = (id: string) => request(`/${id}/dashboard`);

export const checkInTicket = (id: string, code: string) =>
  request(`/${id}/check-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

export const toggleWishlist = (id: string, userId: string, saved: boolean) =>
  request(`/${id}/wishlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, saved }),
  });

export const generateEventDescription = (bullets: string[]) =>
  request("/ai/description", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bullets }),
  });

export const submitReview = (id: string, body: unknown) =>
  request(`/${id}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const getReviews = (id: string) => request(`/${id}/reviews`);

export const submitFeedback = (id: string, body: unknown) =>
  request(`/${id}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const requestRefund = (bookingId: string) =>
  request(`/bookings/${bookingId}/refund`, { method: "POST" });

export const decideRefund = (bookingId: string, status: "approved" | "rejected") =>
  request(`/bookings/${bookingId}/refund`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

export const saveNetworkingPreference = (id: string, body: unknown) =>
  request(`/${id}/networking`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const getNetworkingAttendees = (id: string) => request(`/${id}/networking`);

export const getRecommendations = (body: { categories?: string[]; attendedEventIds?: string[] }) =>
  request("/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const suggestEventSchedule = (sessions: unknown[]) =>
  request("/ai/schedule", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessions }),
  });

export const verifyCheckout = (id: string, body: unknown) =>
  request(`/${id}/checkout/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const registerUser = (body: unknown) => fetch("http://localhost:5000/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.message || "Registration failed"); return data; });

export const loginUser = (body: unknown) => fetch("http://localhost:5000/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.message || "Login failed"); return data; });

export const uploadBanner = (file: File) => { const form = new FormData(); form.append("banner", file); return fetch("http://localhost:5000/api/uploads/banner", { method: "POST", headers: authHeaders(), body: form }).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.message || "Upload failed"); return data; }); };