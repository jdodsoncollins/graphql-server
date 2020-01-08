import React, { useEffect } from "react";
import { NextPage, NextPageContext } from "next";

import { useAuth } from "@/app/lib/auth/use_auth";
import { updateExpiredToken } from "@/app/lib/auth/update_expired_token";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";
import { parseCookies } from "nookies";

export type WithAuthProps = {
  jit: string;
  jid: string;
  isServer: boolean;
};

export function withAuth(WrappedComponent: NextPage<any>, _guarded = false) {
  const AuthenticatedRoute: NextPage<WithAuthProps> = ({ jit, jid, isServer = false, ...props }) => {
    const { setAuth, accessToken, ...auth } = useAuth();

    console.log({_guarded, props});


    // useEffect(() => {
    //   if (isServer) {
    //     setAuth({ jit, jid });
    //   }
    // }, [accessToken.authorizationString]);

    return <WrappedComponent {...auth} {...props} />;
  };

  AuthenticatedRoute.getInitialProps = async (ctx: NextPageContext & any) => {
    console.log("auth route get initial props", ctx);

    const isServer = !!ctx.req;

    if (isServer) {
      const { jid = "" } = parseCookies(ctx);
      const accessToken = new AccessToken(await updateExpiredToken(jid));

      console.log("access token expired: ", accessToken.isExpired);
      console.log("SHOULD BE REDIRECTING????");
    }

    // if (_guarded && accessToken.isExpired) {
    //     console.log("SHOULD BE REDIRECTING");
    //     redirectToLogin(ctx);
    //   }

    return {
      ...(WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))),
      // jit: accessToken.token,
      // jid,
      isServer,
    };
  };

  return AuthenticatedRoute;
}
