import React from "react";
import { withApollo } from "@/app/lib/apollo_next";
import ApolloClient from "apollo-client";
import App, { AppProps } from "next/app";

import { AppProviders } from "@/app/lib/app_providers";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";

type Props = AppProps & {
  apollo: ApolloClient<{}>;
};

class MyApp extends App<Props> {
  render() {
    const { Component, pageProps, apollo } = this.props;
    return (
      <AppProviders apollo={apollo} accessToken={new AccessToken(pageProps.jit)}>
        <Component {...pageProps} />
      </AppProviders>
    );
  }
}

export default withApollo(MyApp);
