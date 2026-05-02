const API_BASE = import.meta.env.VITE_API_URL
console.log(API_BASE);

console.log("Api ",API_BASE)
export const loginUser = async (username) => {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // THIS IS KEY for your session cookies!
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login failed");
  }

  return response.json();
};