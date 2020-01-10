import React from "react";
import { withApollo } from "@/app/lib/apollo_next";
import ApolloClient from "apollo-client";
import App, { AppProps } from "next/app";

import { AppProviders } from "@/app/lib/app_providers";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";
import { RefreshToken } from "@/app/lib/auth/tokens/refresh_token";

type Props = AppProps & {
  apollo: ApolloClient<{}>;
};

class MyApp extends App<Props> {
  render() {
    const { Component, pageProps, apollo } = this.props;
    const accessToken = new AccessToken(pageProps.jit);
    const refreshToken = new RefreshToken(pageProps.jid);
    console.log({ pageProps, accessToken });

    return (
      <AppProviders apollo={apollo} accessToken={accessToken} refreshToken={refreshToken}>
        <Component {...pageProps} />
      </AppProviders>
    );
  }
}

export default withApollo(MyApp);
