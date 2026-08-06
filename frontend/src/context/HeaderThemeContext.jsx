import { createContext, useContext, useEffect, useState } from "react";

const HeaderThemeContext = createContext(null);

export function HeaderThemeProvider({ children }) {
  const [transparent, setTransparent] = useState(false);
  return (
    <HeaderThemeContext.Provider value={{ transparent, setTransparent }}>
      {children}
    </HeaderThemeContext.Provider>
  );
}

export function useHeaderTheme() {
  const ctx = useContext(HeaderThemeContext);
  if (!ctx) throw new Error("useHeaderTheme must be used within a HeaderThemeProvider");
  return ctx;
}

/**
 * Call from any page that wants the navbar to render transparent/glass
 * over a hero image at the top of the page. Automatically resets to
 * solid on unmount, so navigating away restores the default header.
 */
export function useTransparentHeader() {
  const { setTransparent } = useHeaderTheme();
  useEffect(() => {
    setTransparent(true);
    return () => setTransparent(false);
  }, [setTransparent]);
}
