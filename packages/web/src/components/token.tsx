import { css } from "emotion";
import * as React from "react";

import { AccessToken } from "@/app/lib/auth/tokens/access_token";
import { RefreshToken } from "@/app/lib/auth/tokens/refresh_token";
import { useAuth } from "@/app/lib/auth/use_auth";

export type AccessTokenProps = {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
};

export const Token: React.FC<{}> = () => {
  const { accessToken, refreshToken } = useAuth();

  const getTokenExp = (token: string) => {
    return token.substr(0, 4) + "..." + token.substr(token.length - 4, 4);
  };

  function getExpInSeconds(expires: number) {
    return (expires - Date.now()) / 1000 + " seconds";
  }

  return (
    <div
      className={css`
        font-size: 14px;
      `}
    >
      <div
        className={css`
          background-color: ${accessToken.isExpired ? "tomato" : "lightseagreen"};
        `}
      >
        <p>accessToken: {getTokenExp(accessToken.token)}</p>
        <p>isExpired: {accessToken.isExpired.toString()}</p>
        {accessToken.isExpired ? null : (
          <>
            <p>Expires At: {accessToken.expiresAt.toLocaleString()}</p>
            <p>Expires At: {accessToken.expiresAt.getTime()}</p>
            <p>Expires In: {getExpInSeconds(accessToken.expiresAt.getTime())}</p>
          </>
        )}
      </div>

      <div
        className={css`
          background-color: ${refreshToken.isExpired ? "tomato" : "lightseagreen"};
        `}
      >
        <p>refreshToken: {getTokenExp(refreshToken.token)}</p>
        {refreshToken.isExpired ? null : (
          <>
            <p>Expires At: {refreshToken.expiresAt.toLocaleString()}</p>
            <p>Expires At: {refreshToken.expiresAt.getTime()}</p>
            <p>Expires In: {getExpInSeconds(refreshToken.expiresAt.getTime())}</p>
          </>
        )}
        <p>isExpired: {refreshToken.isExpired.toString()}</p>
      </div>
    </div>
  );
};
