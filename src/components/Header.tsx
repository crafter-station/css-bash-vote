import { useEffect, useState } from "react";

import { Moon, Sun } from "lucide-react";

interface HeaderProps {
  isSignedIn: boolean;
  userImageUrl?: string;
}

export function Header({ isSignedIn, userImageUrl }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    setTheme((stored as "light" | "dark") || (prefersDark ? "dark" : "light"));
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <header
      style={{
        borderBottom: "1px solid var(--line)",
        background: "var(--bg)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a
          href="/"
          style={{
            fontWeight: 700,
            fontSize: "1rem",
            color: "var(--fg)",
            textDecoration: "none",
            letterSpacing: "-0.02em",
          }}
        >
          css<span style={{ color: "var(--amber)" }}>-bash</span>
        </a>

        <nav style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a
            href="/results"
            style={{
              fontSize: "0.875rem",
              color: "var(--fg-dim)",
              textDecoration: "none",
            }}
          >
            Results
          </a>

          <button
            type="button"
            onClick={toggleTheme}
            style={{
              background: "none",
              border: "1px solid var(--line)",
              borderRadius: "6px",
              padding: "6px",
              cursor: "pointer",
              color: "var(--fg-dim)",
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {isSignedIn ? (
            <a
              href="/api/sign-out"
              style={{
                fontSize: "0.875rem",
                padding: "6px 12px",
                border: "1px solid var(--line)",
                borderRadius: "6px",
                color: "var(--fg)",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {userImageUrl && (
                <img
                  src={userImageUrl}
                  alt="avatar"
                  style={{ width: 20, height: 20, borderRadius: "50%" }}
                />
              )}
              Sign out
            </a>
          ) : (
            <a
              href="/sign-in"
              style={{
                fontSize: "0.875rem",
                padding: "6px 14px",
                background: "var(--fg)",
                color: "var(--bg)",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign in
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}
