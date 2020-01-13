import { createContext, useContext, useEffect, useState } from "react";

import { LoginFormData } from "@/app/components/forms/login_form";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";
import { useLoginMutation, useLogoutMutation, useRevokeRefreshTokensForUserMutation } from "@/generated/graphql";
import { useRouter } from "next/router";

export type AuthType = {
  accessToken: AccessToken;
  login(data: LoginFormData, redirectTo?: string): Promise<void>;
  logout(): Promise<void>;
  revokeTokens(): Promise<void>;
  setAccessToken(accessToken: AccessToken): void;
};

// @ts-ignore
const AuthContext = createContext<AuthType>();

export const AuthProvider = (props: any) => {
  const [accessToken, _setAccessToken] = useState<AccessToken>(new AccessToken());

  // console.log("auth provider props", props.accessToken);
  // console.log("access token", accessToken);

  const router = useRouter();

  useEffect(() => {
    _setAccessToken(props.accessToken)
  }, [props.accessToken.token]);

  const [loginMutation] = useLoginMutation();
  const [logoutMutation, { client }] = useLogoutMutation();
  const [revokeTokenMutation] = useRevokeRefreshTokensForUserMutation();

  const setAccessToken = (_accessToken: AccessToken) => {
    console.log("setAccessToken", _accessToken.token);
    _setAccessToken(_accessToken);
  };

  const login = async (data: LoginFormData, redirectTo: string = "/dashboard") => {
    const response = await loginMutation({ variables: { data } });
    if (response.data) {
      setAccessToken(new AccessToken(response.data.login.accessToken));
    }
    if (redirectTo.includes("/login")) {
      redirectTo = "/dashboard";
    }
    // (window as any).location = redirectTo;
    router.push(redirectTo);
  };

  const revokeTokens = async () => {
    if (accessToken.isExpired || !accessToken.decoded.userId) throw new Error("invalid token");
    await revokeTokenMutation({ variables: { userId: accessToken.decoded.userId } });
    await logout();
  };

  const logout = async () => {
    await client?.resetStore();
    await logoutMutation();
    setAccessToken(new AccessToken());
    (window as any).location = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        login,
        logout,
        revokeTokens,
      }}
      {...props}
    />
  );
};

export const useAuth = () => useContext<AuthType>(AuthContext);
