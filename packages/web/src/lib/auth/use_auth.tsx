import { createContext, useContext, useState } from "react";

import { LoginFormData } from "@/app/components/forms/login_form";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";
import { RefreshToken } from "@/app/lib/auth/tokens/refresh_token";
import { useLoginMutation, useLogoutMutation, useRevokeRefreshTokensForUserMutation } from "@/generated/graphql";
import { AccessTokenProps } from "@/app/components/token";
import { setInMemoryAuth } from "@/app/lib/auth/with_auth";

export type AuthType = AccessTokenProps & {
  login(data: LoginFormData, redirectTo?: string): Promise<void>;
  logout(): Promise<void>;
  revokeTokens(): Promise<void>;
  setAuth(auth: AccessTokenProps): void;
};

// @ts-ignore
const AuthContext = createContext<AuthType>();

export const AuthProvider = (props: AccessTokenProps & any) => {

  const [auth, _setAuth] = useState<AccessTokenProps>({
    accessToken: new AccessToken(props.accessToken.token),
    refreshToken: new RefreshToken(props.refreshToken.token),
  });

  const [loginMutation] = useLoginMutation();
  const [logoutMutation, { client }] = useLogoutMutation();
  const [revokeTokenMutation] = useRevokeRefreshTokensForUserMutation();

  const login = async (data: LoginFormData, redirectTo: string = "/dashboard") => {
    const response = await loginMutation({ variables: { data } });
    if (response.data) {
      _setAuth({ ...auth, accessToken: new AccessToken(response.data.login.accessToken) });
    }
    if (redirectTo.includes("/login")) {
      redirectTo = "/dashboard";
    }
    (window as any).location = redirectTo;
  };

  const revokeTokens = async () => {
    if (auth.accessToken.isExpired || !auth.accessToken.decoded.userId) throw new Error("invalid token");
    await revokeTokenMutation({ variables: { userId: auth.accessToken.decoded.userId } });
    await logout();
  };

  const logout = async () => {
    await client?.resetStore();
    await logoutMutation();
    _setAuth({
      accessToken: new AccessToken(),
      refreshToken: new RefreshToken(),
    });
    (window as any).location = "/login";
  };

  const setAuth = (auth: AccessTokenProps) => {
    setInMemoryAuth(auth);
    _setAuth(auth);
  };

  console.log("HI JASON 22222");
  console.log(auth.accessToken);

  return (
    <AuthContext.Provider
      value={{
        setAuth,
        login,
        logout,
        revokeTokens,
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
      }}
      {...props}
    />
  );
};

export const useAuth = () => useContext<AuthType>(AuthContext);
