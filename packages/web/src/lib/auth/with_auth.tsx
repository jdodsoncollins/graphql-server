import React, { useEffect } from "react";
import { NextPage, NextPageContext } from "next";
import { useRouter } from "next/router";

import { updateExpiredToken } from "@/app/lib/auth/update_expired_token";
import { useAuth } from "@/app/lib/auth/use_auth";
import { getRedirectLink, Redirect } from "@/app/lib/redirect";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";

type Props = {
  jid: string;
  jit: string;
  isServer: boolean;
};

export function withAuth(WrappedComponent: any, guarded = false) {
  const AuthenticatedRoute: NextPage<Props> = props => {
    const { isServer } = props;

    const router = useRouter();
    const { accessToken, setAccessToken } = useAuth();

    useEffect(() => {
      if (isServer || accessToken.isExpired) {
        setInMemoryAuth(accessToken);
        setAccessToken(accessToken);
      }
    }, [accessToken.token]);

    useEffect(() => {
      if (guarded && accessToken.isExpired) {
        console.log("REDIRECT EM");
        router.replace(getRedirectLink(router.pathname));
      }
    }, [accessToken.token]);

    return <WrappedComponent {...props} />;
  };

  AuthenticatedRoute.getInitialProps = async (ctx: NextPageContext) => {
    let isServer = !!ctx.req;
    let accessToken: AccessToken = getFromInMemory();

    if (isServer || accessToken.isExpired) {
      console.log("is server", isServer);
      console.log("is expired", accessToken.isExpired);
      accessToken = await updateExpiredToken();
      console.log("is expired", accessToken.isExpired);
    }

    if (guarded && accessToken.isExpired) {
      console.log("I SHOULD BE REDIRECTED HOME");
      Redirect(getRedirectLink(ctx.pathname), ctx);
    }

    return {
      ...(WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))),
      jit: accessToken.token,
      isServer,
    };
  };

  return AuthenticatedRoute;
}

let inMemoryAccessToken = new AccessToken();

export const getFromInMemory = () => {
  return inMemoryAccessToken;
};

export const setInMemoryAuth = (accessToken: AccessToken) => {
  if (typeof window === "undefined") {
    throw new Error("only set in memory tokens on the browser");
  }
  inMemoryAccessToken = accessToken;
};
