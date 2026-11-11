export const THEME_KEY = "theme";

// Inlined in <head> (app/layout.jsx) so the saved theme, or the system one, is applied before the page paints
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})()`;
