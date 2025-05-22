import { useEffect } from "react";

export function usePreservedScroll(ref: React.RefObject<any>) {
  useEffect(() => {
    const saved = localStorage.getItem("scrollOffset");
    if (saved && ref.current) {
      setTimeout(() => {
        ref.current.scrollTo(parseInt(saved));
      }, 100);
    }

    const save = () => {
      if (ref.current) {
        localStorage.setItem(
          "scrollOffset",
          ref.current.state.scrollOffset.toString()
        );
      }
    };

    window.addEventListener("beforeunload", save);
    return () => window.removeEventListener("beforeunload", save);
  }, []);
}
