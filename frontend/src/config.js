// Centralized backend URL config.
//
// In production (Netlify build) this defaults to your deployed Render
// backend, so the site works even if you forget to set env vars on Netlify.
// You can override it by setting VITE_API_URL in Netlify's Environment
// Variables (Site settings -> Environment variables) or in a local .env file.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://medical-healthcare-platform.onrender.com'
    : 'http://localhost:5000')
