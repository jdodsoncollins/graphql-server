import { TokenRefreshLink } from "apollo-link-token-refresh";

import client from "@/app/lib/client";

export const refreshAccessToken = (cookie = "") => {
  return client("/auth/refresh_token", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      cookie,
    },
  });
};

export const refreshLink = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    console.log("isTokenValidOrUndefined");
    return true;
  },
  fetchAccessToken: refreshAccessToken,
  handleFetch: accessToken => {
    console.log("handleFetch", accessToken);
  },
  handleError: err => {
    console.error("Your refresh token is invalid. Try to re-login");
    console.error(err);
  },
});
