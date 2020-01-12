import { refreshAccessToken } from "@/app/lib/apollo_token_refresh_link";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";
import { RefreshToken } from "@/app/lib/auth/tokens/refresh_token";

const EXPIRED_ACCESS_TOKEN = new AccessToken();

export const updateExpiredToken = async (
  refreshToken: RefreshToken,
  accessToken?: AccessToken
): Promise<AccessToken> => {
  console.log("update expired token", { refreshToken, accessToken });

  if (refreshToken.isExpired) {
    console.log("ACCESS TOKEN FAILURE 1");
    return EXPIRED_ACCESS_TOKEN;
  }

  console.log("ISVALID", accessToken?.isValid);

  if (accessToken?.isValid) {
    console.log("ACCESS TOKEN IS VALID");
    return accessToken;
  }

  const res = await refreshAccessToken(refreshToken.token);
  if (res.success) {
    console.log("ACCESS TOKEN UPDATE IS SUCCESS");
    return new AccessToken(res.accessToken);
  }

  console.log("ACCESS TOKEN FAILURE 2");
  return EXPIRED_ACCESS_TOKEN;
};
