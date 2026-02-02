import { useEffect, useState } from "react";
import { fetchSuggestions } from "../services/suggestionService";

export default function SuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchSuggestions().then(setSuggestions);
  }, []);

  return (
    <div>
      <h1>Suggestions</h1>
      <ul>
        {suggestions.map((s) => (
          <li key={s._id || s.id}>{s.text || JSON.stringify(s)}</li>
        ))}
      </ul>
    </div>
  );
}
