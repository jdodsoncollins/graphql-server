import { css } from "emotion";
import * as React from "react";

import { useAuth } from "@/app/lib/auth/use_auth";
import { colors } from "@/styles/theme";

export const Token: React.FC<{}> = () => {
  const { accessToken } = useAuth();

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
        background-color: ${accessToken.isExpired ? colors.red["500"] : colors.green["500"]};
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
  );
};
