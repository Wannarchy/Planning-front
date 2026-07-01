// En dev : proxy Vite /api → localhost:8080
// En prod : proxy Netlify /api → Railway (voir netlify.toml)
// Surcharge possible via VITE_API_URL
export const API_BASE = import.meta.env.VITE_API_URL || "/api";
