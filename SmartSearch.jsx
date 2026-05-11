import React, { useEffect, useState } from "react";

function SmartSearch() {
  const items = [
    "Anatom Automatic Skeleton",
    "Integeral",
    "The Square",
    "Anatom Watch",
    "Blal's"
  ];

  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(items);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      const result = items.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );

      setFiltered(result);
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div>
      <h2>Smart Search</h2>

      <input
        type="text"
        placeholder="Search language..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading ? (
        <p>⏳ Loading...</p>
      ) : (
        <ul>
          {filtered.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SmartSearch;