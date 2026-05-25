// API url
const API_URL = "http://127.0.0.1:8000";

// Exports async function named loginUser.
export const loginUser = async (
  email,
  password
) => {
  const body = new URLSearchParams();

  body.append("username", email);
  body.append("password", password);

  // Adds the username and password
  const res = await fetch(
    `${API_URL}/token`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded"
      },
      body
    }
  );

  //If the response is not ok, throw an error
  if (!res.ok) {
    throw new Error(
      "Invalid login credentials"
    );
  }

  return await res.json();
};

// Exports an async function to register a new user
export const registerUser = async (
  email,
  password
) => {
  // Sends JSON containing username and password
  const res = await fetch(
    `${API_URL}/register`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json"
      },
      body: JSON.stringify({
        username: email,
        password
      })
    }
  );

  const data = await res.json();

  // If registration failed, throw an error
  if (!res.ok) {
    throw new Error(
      data.detail ||
      "Registration failed"
    );
  }

  return data;
};

// Exports a function to fetch items from the backend
export const getItems = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_URL}/items`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  // Throws an error if the request failed
  if (!res.ok) {
    throw new Error(
      data.detail || "Failed to retrieve items"
    );
  }

  return data;
};

// Exports a function to save a history entry
export const saveHistory = async (
  flashcardSet,
  action
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_URL}/history?flashcard_set=${encodeURIComponent(
      flashcardSet
    )}&action=${encodeURIComponent(action)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  // Throws an error if saving failed
  if (!res.ok) {
    throw new Error(
      data.detail || "Failed to save history"
    );
  }

  return data;
};

// Exports a function to fetch all history entries
export const getHistory = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_URL}/view_history`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  // Throws an error if the request failed
  if (!res.ok) {
    throw new Error(
      data.detail || "Failed to retrieve history"
    );
  }

  return data;
};

// Exports a function to save flashcard sets
export const saveItems = async (
  payload
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_URL}/items`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  const data = await res.json();

  // Throws an error if saving failed
  if (!res.ok) {
    throw new Error(
      data.detail || "Failed to save items"
    );
  }

  return data;
};