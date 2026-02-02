import React, { useEffect, useState } from "react";
import { getSuggestions, deleteSuggestion } from "../services/suggestionService";

export default function ManageSuggestions() {
  const [suggestions, setSuggestions] = useState([]);

  async function load() {
    const res = await getSuggestions();
    setSuggestions(res);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await load();
    })();
    return () => { mounted = false; };
  }, []);

  async function handleDelete(id) {
    await deleteSuggestion(id);
    load();
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Manage Suggestions</h1>

      <div className="grid gap-4 max-w-4xl">
        {suggestions.map((s) => (
          <div key={s._id} className="bg-white p-6 rounded-2xl shadow flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">{s.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{s.description}</p>
            </div>

            <button onClick={() => handleDelete(s._id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
