const A_BASE = "http://localhost:5000/api/admin";

export async function adminLogin(creds) {
  const res = await fetch(`${A_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(creds),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json(); // { token, admin }
}

export default { adminLogin };
