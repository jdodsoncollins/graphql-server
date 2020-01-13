import { refreshAccessToken } from "@/app/lib/apollo_token_refresh_link";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";

const EXPIRED_ACCESS_TOKEN = new AccessToken();

export const updateExpiredToken = async (): Promise<AccessToken> => {
  const res = await refreshAccessToken();
  if (res.success) {
    console.log("SUCCESS UPDATE", res.accessToken);
    return new AccessToken(res.accessToken);
  }
  console.log("FAILED UPDATE", "aaaaaaaaaaaaaa");

  return EXPIRED_ACCESS_TOKEN;
};
