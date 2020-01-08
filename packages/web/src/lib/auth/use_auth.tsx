import { createContext, useContext, useState } from "react";

import { AccessToken } from "@/app/lib/auth/tokens/access_token";
import { RefreshToken } from "@/app/lib/auth/tokens/refresh_token";
import { useLoginMutation, useLogoutMutation, useRevokeRefreshTokensForUserMutation } from "@/generated/graphql";
import { LoginFormData } from "@/app/components/forms/login_form";

export type AuthType = {
  login(data: LoginFormData): Promise<void>;
  logout(): Promise<void>;
  revokeTokens(): Promise<void>;
  accessToken: AccessToken;
  refreshToken: RefreshToken;
  setAuth({ jit, jid }: { jit: string; jid: string }): void;
};

// @ts-ignore
const AuthContext = createContext<AuthType>();

export const AuthProvider = (props: any) => {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();

  const [loginMutation] = useLoginMutation();
  const [logoutMutation, { client }] = useLogoutMutation();
  const [revokeTokenMutation] = useRevokeRefreshTokensForUserMutation();

  const login = async (data: LoginFormData) => {
    const response = await loginMutation({ variables: { data } });
    if (response.data) {
      setAccessToken(response.data.login.accessToken);
    }
  };

  const revokeTokens = async () => {
    const token = new AccessToken(accessToken);
    if (token.isExpired || !token.decoded.userId) throw new Error("invalid token");
    await revokeTokenMutation({ variables: { userId: token.decoded.userId } });
    await logout();
  };

  const logout = async () => {
    alert("LOGOUT");
    await logoutMutation();
    await client?.resetStore();
    setAccessToken("");
    setRefreshToken("");
  };

  const setAuth = ({ jit, jid }: { jit: string; jid: string }) => {
    // console.log("SET AUTH", jit[0], jid[0]);
    setAccessToken(jit);
    setRefreshToken(jid);
  };

  console.log("use auth function call", accessToken, refreshToken);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        revokeTokens,
        setAuth,
        accessToken: new AccessToken(accessToken),
        refreshToken: new RefreshToken(refreshToken),
      }}
      {...props}
    />
  );
};

export const useAuth = () => useContext<AuthType>(AuthContext);
