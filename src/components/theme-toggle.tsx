"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  return (
    <button
      aria-label="Changer le thème"
      className="theme-toggle"
      disabled={!mounted}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      title="Changer le thème"
      type="button"
    >
      <span aria-hidden="true">{mounted && resolvedTheme === "dark" ? "Sombre" : "Clair"}</span>
    </button>
  );
}
