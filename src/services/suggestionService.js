const BASE_URL = "http://localhost:5000/api/suggestions";

export async function getSuggestions() {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch suggestions");
    return res.json();
  } catch (error) {
    console.error("Get suggestions error:", error);
    throw error;
  }
}

export async function addSuggestion(data) {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add suggestion");
    return res.json();
  } catch (error) {
    console.error("Add suggestion error:", error);
    throw error;
  }
}

export async function deleteSuggestion(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to delete suggestion");
    return res.json();
  } catch (error) {
    console.error("Delete suggestion error:", error);
    throw error;
  }
}

export async function updateSuggestion(id, data) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update suggestion");
    return res.json();
  } catch (error) {
    console.error("Update suggestion error:", error);
    throw error;
  }
}
