import React, { useEffect } from "react";
import { parseCookies } from "nookies";
import { NextPage, NextPageContext } from "next";

import { updateExpiredToken } from "@/app/lib/auth/update_expired_token";
import { useAuth } from "@/app/lib/auth/use_auth";
import { useRouter } from "next/router";
import { getRedirectLink } from "@/app/lib/redirect";

export type WithAuthProps = {
  jit: string;
  jid: string;
  isServer: boolean;
};

export const isServer = () => typeof window === "undefined";

export function withAuth(WrappedComponent: NextPage<any>, guarded = false) {
  const AuthenticatedRoute: NextPage<WithAuthProps> = ({ jit, jid, isServer = false, ...props }) => {
    const { setAuth, accessToken } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isServer) {
        setAuth({ jit, jid });
      }
    }, [accessToken.token]);

    useEffect(() => {
      if (guarded && accessToken.isExpired) {
        router.replace(getRedirectLink(router.pathname));
      }
    }, [accessToken.token]);

    return <WrappedComponent {...props} />;
  };

  AuthenticatedRoute.getInitialProps = async (ctx: NextPageContext & any) => {
    let isServer = !!ctx.req;
    let jid = "";
    let jit = "";

    if (isServer) {
      jid = parseCookies(ctx).jid ?? "";
      jit = await updateExpiredToken(jid);
    }

    return {
      ...(WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))),
      jid,
      jit,
      isServer,
    };
  };

  return AuthenticatedRoute;
}
