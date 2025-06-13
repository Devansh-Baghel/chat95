import { useState } from "react";
import { usePuterUser } from "~/hooks/usePuterUser";

export default function CheckAuth() {
  const { user, isLoading, signInWithPuter } = usePuterUser();

  if (isLoading) return "Loading...";

  if (!user)
    return (
      <button className="p-4 bg-blue-400" onClick={signInWithPuter}>
        Authborize with Puter
      </button>
    );

  // TODO: move to /chat or whatever
  return (
    <div>
      <h3>Welcome, {user.username}</h3>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
