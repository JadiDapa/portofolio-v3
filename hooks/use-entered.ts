import { useEffect, useState } from "react";

/** False on the first paint, true on the next frame: lets a CSS transition run on mount. */
export function useEntered() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return entered;
}
