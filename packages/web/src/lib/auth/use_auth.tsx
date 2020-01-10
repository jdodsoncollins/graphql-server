import { createContext, useContext, useState } from "react";

import { LoginFormData } from "@/app/components/forms/login_form";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";
import { RefreshToken } from "@/app/lib/auth/tokens/refresh_token";
import { useLoginMutation, useLogoutMutation, useRevokeRefreshTokensForUserMutation } from "@/generated/graphql";
import { AccessTokenProps } from "@/app/components/token";

export type AuthType = AccessTokenProps & {
  login(data: LoginFormData, redirectTo?: string): Promise<void>;
  logout(): Promise<void>;
  revokeTokens(): Promise<void>;
  setAuth(jid: string, jit: string): void;
};

// @ts-ignore
const AuthContext = createContext<AuthType>();

export const AuthProvider = (props: AccessTokenProps & any) => {
  const [accessToken, setAccessToken] = useState<AccessToken>(new AccessToken(props.accessToken.token));
  const [refreshToken, setRefreshToken] = useState<RefreshToken>(new RefreshToken(props.refreshToken.token));

  const [loginMutation] = useLoginMutation();
  const [logoutMutation, { client }] = useLogoutMutation();
  const [revokeTokenMutation] = useRevokeRefreshTokensForUserMutation();

  const login = async (data: LoginFormData, redirectTo: string = "/dashboard") => {
    const response = await loginMutation({ variables: { data } });
    if (response.data) {
      setAccessToken(new AccessToken(response.data.login.accessToken));
    }
    if (redirectTo.includes("/login")) {
      redirectTo = "/dashboard";
    }
    (window as any).location = redirectTo;
  };

  const revokeTokens = async () => {
    if (accessToken.isExpired || !accessToken.decoded.userId) throw new Error("invalid token");
    await revokeTokenMutation({ variables: { userId: accessToken.decoded.userId } });
    await logout();
  };

  const logout = async () => {
    await client?.resetStore().catch(e => console.log(e));
    await logoutMutation();
    setAccessToken(new AccessToken());
    setRefreshToken(new RefreshToken());
    (window as any).location = "/login";
  };

  const setAuth = (jid: string, jit: string) => {
    console.log("setauth", { jid, jit });
    setAccessToken(new AccessToken(jit));
    setRefreshToken(new RefreshToken(jid));
    console.log("accessToken is valid", accessToken.isValid, new AccessToken(jit).isValid);
    console.log("refreshToken is valid", !refreshToken.isExpired);
  };

  return (
    <AuthContext.Provider
      value={{
        setAuth,
        login,
        logout,
        revokeTokens,
        accessToken,
        refreshToken,
      }}
      {...props}
    />
  );
};

export const useAuth = () => useContext<AuthType>(AuthContext);
