import { createAuthClient } from "better-auth/react";
import { API_URLS } from "@/service/api";

// Keep browser requests credentialed so the API's session cookie is included.
const authClient = createAuthClient({
  baseURL: API_URLS.base,
  fetchOptions: {
    credentials: "include",
  },
});

export default authClient;
