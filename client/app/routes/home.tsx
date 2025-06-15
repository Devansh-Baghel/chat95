import type { Route } from "./+types/home";
import { useState } from "react";
import { Link } from "react-router";
import { v4 as uuidv4 } from "uuid";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [uuid, setUuid] = useState(uuidv4());

  return (
    <div>
      <h2>Puter.js Streamed Chat</h2>
      <input
        type="text"
        placeholder="Ask something..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Link to={`/chat/${uuid}?query=${query}`}>Chat</Link>
    </div>
  );
}
