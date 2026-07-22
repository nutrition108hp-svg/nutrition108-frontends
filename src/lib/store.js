import { useCallback, useEffect, useState } from "react";

const KEY = "n108_passport";

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { saved: [], compare: [] };
  } catch {
    return { saved: [], compare: [] };
  }
}

function write(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("passport-change"));
}

export function usePassport() {
  const [state, setState] = useState(read);

  useEffect(() => {
    const handler = () => setState(read());
    window.addEventListener("passport-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("passport-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const toggleSave = useCallback((id) => {
    const d = read();
    d.saved = d.saved.includes(id) ? d.saved.filter((x) => x !== id) : [...d.saved, id];
    write(d);
  }, []);

  const toggleCompare = useCallback((id) => {
    const d = read();
    if (d.compare.includes(id)) d.compare = d.compare.filter((x) => x !== id);
    else if (d.compare.length < 5) d.compare = [...d.compare, id];
    write(d);
  }, []);

  const clearCompare = useCallback(() => {
    const d = read();
    d.compare = [];
    write(d);
  }, []);

  return {
    saved: state.saved,
    compare: state.compare,
    isSaved: (id) => state.saved.includes(id),
    inCompare: (id) => state.compare.includes(id),
    toggleSave,
    toggleCompare,
    clearCompare,
  };
}
