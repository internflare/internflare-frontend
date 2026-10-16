import { createAuthClient } from "better-auth/react";

const authUrl = import.meta.env.VITE_BETTER_AUTH_URL ?? "http://localhost:3001";

// Keep browser requests credentialed so the API's session cookie is included.
const authClient = createAuthClient({
  baseURL: authUrl,
  fetchOptions: {
    credentials: "include",
  },
});

export default authClient;
