import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import axios from "axios";
import { PuterUserProvider, usePuterUser } from "./hooks/usePuterUser";
import SideBar from "./components/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Frame } from "react95";
import { createGlobalStyle, ThemeProvider } from "styled-components";

import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";
import TopBar from "./components/topbar";
import { useThemeStore } from "./stores/themeStore";
import logo from "@react95/icons/svg/Logo_32x32_4.svg";
import { useSidebarStore } from "./stores/sidebarStore";
import WelcomePage from "./components/welcome";
import LoadingPage from "./components/loading";
import { Toaster } from "react-hot-toast";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body, input, select, textarea {
    font-family: 'ms_sans_serif';
  }
`;

export const queryClient = new QueryClient();

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg" href={logo} />
        <Meta />
        <Links />
      </head>
      <body>
        <GlobalStyles />
        <PuterUserProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </QueryClientProvider>
        </PuterUserProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chat95" },
    { name: "Chat95", content: "Welcome to Chat95!" },
  ];
}

export default function App() {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;

  const { user, isLoading } = usePuterUser();
  const { isOpen } = useSidebarStore();

  // Loading Progress Bar
  if (isLoading) return <LoadingPage />;

  if (!user) return <WelcomePage />;

  return (
    <Frame
      variant="outside"
      className="min-h-screen w-full p-3 flex! flex-col gap-3"
    >
      {/* {isOpen && <TopBar />} */}
      <TopBar />
      <div className="flex flex-1 overflow-hidden! gap-4">
        {isOpen && <SideBar />}
        <Outlet />
      </div>
      <Toaster />
    </Frame>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
