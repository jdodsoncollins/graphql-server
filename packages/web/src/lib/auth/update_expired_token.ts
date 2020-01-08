import { refreshAccessToken } from "@/app/lib/apollo_token_refresh_link";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";
import { RefreshToken } from "@/app/lib/auth/tokens/refresh_token";

export const updateExpiredToken = async (jid = "", jit = ""): Promise<string> => {
  let accessToken = new AccessToken(jit);
  let refreshToken = new RefreshToken(jid);

  if (accessToken.isValid) {
    return jit;
  }

  if (refreshToken.isExpired) {
    return "";
  }

  const res = await refreshAccessToken(refreshToken.token);
  if (!res.success) {
    return "";
  }

  return res.accessToken;
};
