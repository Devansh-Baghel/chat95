import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import usePuter from "./usePuter";

type PuterUser = any;

interface PuterUserContextType {
  user: PuterUser | null;
  setUser: React.Dispatch<React.SetStateAction<PuterUser | null>>;
  signInWithPuter: () => Promise<void>;
  isLoading: boolean;
}

const PuterUserContext = createContext<PuterUserContextType>({
  user: null,
  setUser: () => {},
  signInWithPuter: async () => {},
  isLoading: true,
});

export function PuterUserProvider({ children }: { children: React.ReactNode }) {
  const puter = usePuter();
  const [user, setUser] = useState<PuterUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore from localStorage (on client)
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("puterUser");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse user from localStorage:", e);
        }
      }
    }
  }, []);

  // Check auth status when puter is ready
  useEffect(() => {
    if (!puter) return;

    const checkSignedIn = async () => {
      setIsLoading(true);
      try {
        const isSignedIn = puter.auth.isSignedIn();
        if (isSignedIn) {
          const whoami = await puter.auth.whoami();
          setUser(whoami);
          localStorage.setItem("puterUser", JSON.stringify(whoami));
        } else {
          setUser(null);
          localStorage.removeItem("puterUser");
        }
      } catch (err) {
        console.warn("Failed to check Puter auth status:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSignedIn();
  }, [puter]);

  const signInWithPuter = async () => {
    setIsLoading(true);
    try {
      await puter.auth.signIn();
      const whoami = await puter.auth.whoami();
      setUser(whoami);
      localStorage.setItem("puterUser", JSON.stringify(whoami));
    } catch (error) {
      console.error("Failed to sign in with Puter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PuterUserContext.Provider
      value={{ user, setUser, signInWithPuter, isLoading }}
    >
      {children}
    </PuterUserContext.Provider>
  );
}

export function usePuterUser() {
  return useContext(PuterUserContext);
}
