import React, { useEffect } from "react";
import { parseCookies } from "nookies";
import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";

import { updateExpiredToken } from "@/app/lib/auth/update_expired_token";
import { useAuth } from "@/app/lib/auth/use_auth";
import { getRedirectLink, Redirect } from "@/app/lib/redirect";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";
import { RefreshToken } from "@/app/lib/auth/tokens/refresh_token";
import { AccessTokenProps } from "@/app/components/token";

type Props = {
  jid: string;
  jit: string;
  isServer: boolean;
};

export function withAuth(WrappedComponent: any, guarded = false) {
  const AuthenticatedRoute: NextPage<Props> = props => {
    const { jid, jit, isServer } = props;
    const { accessToken, setAuth } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isServer || accessToken.isExpired) {
        setInMemoryAuth({
          accessToken: new AccessToken(jit),
          refreshToken: new RefreshToken(jid),
        });
      }

      if (accessToken.isExpired) {
        setAuth(jid, jit);
      }

      if (guarded && accessToken.isExpired) {
        router.replace(getRedirectLink(router.pathname));
      }
    }, [jit + "_" + jid]);

    return <WrappedComponent {...props} />;
  };

  AuthenticatedRoute.getInitialProps = async (ctx: NextPageContext & any) => {
    let isServer = !!ctx.req;
    let accessToken: AccessToken | undefined;
    let refreshToken: RefreshToken;

    if (isServer) {
      refreshToken = new RefreshToken(parseCookies(ctx).jid);
    } else {
      const auth = getFromInMemory();
      console.log("get from in memory", { auth, accessValid: auth.accessToken.isValid });
      accessToken = auth.accessToken;
      refreshToken = auth.refreshToken;
    }

    if (isServer || !!accessToken?.isExpired) {
      accessToken = await updateExpiredToken(refreshToken, accessToken);
    }

    console.log({
      withAuth: "get initial props",
      refreshTokenValid: !refreshToken.isExpired,
      accessTokenValid: accessToken?.isValid,
    });

    if (guarded && !!accessToken?.isExpired) {
      Redirect(getRedirectLink(ctx.pathname), ctx);
    }

    return {
      ...(WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))),
      jid: refreshToken.token,
      jit: accessToken?.token ?? "",
      isServer,
    };
  };

  return AuthenticatedRoute;
}

let inMemoryAccessToken = new AccessToken();
let inMemoryRefreshToken = new RefreshToken();

export const getFromInMemory = () => {
  return {
    accessToken: inMemoryAccessToken,
    refreshToken: inMemoryRefreshToken,
  };
};

export const setInMemoryAuth = ({ accessToken, refreshToken }: AccessTokenProps) => {
  if (typeof window === "undefined") {
    throw new Error("only set in memory tokens on the browser");
  }
  inMemoryAccessToken = accessToken;
  inMemoryRefreshToken = refreshToken;
  console.log({ inMemoryAccessToken, inMemoryRefreshToken });
};
