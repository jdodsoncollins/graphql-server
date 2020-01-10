import { refreshAccessToken } from "@/app/lib/apollo_token_refresh_link";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";
import { RefreshToken } from "@/app/lib/auth/tokens/refresh_token";

export const updateExpiredToken = async (
  refreshToken: RefreshToken,
  accessToken?: AccessToken
): Promise<AccessToken> => {
  const FAILURE = new AccessToken();

  if (refreshToken.isExpired) {
    return FAILURE;
  }

  if (accessToken?.isValid) {
    return accessToken;
  }

  const res = await refreshAccessToken(refreshToken.token);
  if (!res.success) {
    return FAILURE;
  }

  return new AccessToken(res.accessToken);
};
