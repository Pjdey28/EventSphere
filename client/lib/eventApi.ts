const API_URL = "http://localhost:5000/api/events";

export const createEvent = async (eventData: any) => {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
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