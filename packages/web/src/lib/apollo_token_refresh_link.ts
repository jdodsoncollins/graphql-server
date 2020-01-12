import client from "@/app/lib/client";
import { TokenRefreshLink } from "apollo-link-token-refresh";

export const refreshAccessToken = (jid = ""): Promise<{ success: boolean; accessToken: string }> | any => {
  return client("/auth/refresh_token", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      cookie: `jid=${jid}`,
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
