export async function adminLogin(credentials) {
  try {
    const res = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Login failed");
    }
    
    return res.json(); // { token, admin }
  } catch (error) {
    throw error;
  }
}

export async function adminLogout() {
  try {
    const res = await fetch("http://localhost:5000/api/admin/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  } catch (error) {
    throw error;
  }
}
