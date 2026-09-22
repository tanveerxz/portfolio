/** Server-safe theme constants (no React import): used by app/layout.tsx. */
export type Theme = "dark" | "light";

export const THEME_KEY = "portfolio-theme";

/** Browser chrome colour per theme (= --surface-0). */
export const THEME_COLOR: Record<Theme, string> = {
  dark: "#0b0d12",
  light: "#f1f0ec",
};

/**
 * Inline, render-blocking boot script (kept tiny, no dependencies). Sets
 * html[data-theme] before paint and syncs the meta tags, including ones the
 * parser has not reached yet.
 */
export const themeBoot = `(function(){var t='dark';try{var s=localStorage.getItem('${THEME_KEY}');if(s==='light'||s==='dark')t=s;}catch(e){}var d=document.documentElement;d.dataset.theme=t;function m(){var a=document.querySelector('meta[name="theme-color"]');if(a)a.setAttribute('content',t==='light'?'${THEME_COLOR.light}':'${THEME_COLOR.dark}');var b=document.querySelector('meta[name="color-scheme"]');if(b)b.setAttribute('content',t);}m();if(t!=='dark')document.addEventListener('DOMContentLoaded',m);})();`;

