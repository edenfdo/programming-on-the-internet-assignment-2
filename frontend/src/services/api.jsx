const API_URL = "http://127.0.0.1:8000";

export const loginUser = async (
  email,
  password
) => {
  const body = new URLSearchParams();

  body.append("username", email);
  body.append("password", password);

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

  if (!res.ok) {
    throw new Error(
      "Invalid login credentials"
    );
  }

  return await res.json();
};

export const registerUser = async (
  email,
  password
) => {
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

  if (!res.ok) {
    throw new Error(
      data.detail ||
      "Registration failed"
    );
  }

  return data;
};

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

  return await res.json();
};

export const saveHistory = async (
  flashcardSet,
  action
) => {
  console.log("flashcardSet:", flashcardSet);
  console.log("action:", action);
  

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
  console.log("TOKEN:", token);
  return await res.json();
};

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

  return await res.json();
};

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

  return await res.json();
};