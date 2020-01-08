import React from "react";
import withApollo, { apolloLinkSomething } from "@/app/lib/apollo_next";
import ApolloClient from "apollo-client";
import { WithAuthProps } from "@/app/lib/auth/with_auth";
import { AppProviders } from "@/app/lib/app_providers";
import App, { AppProps as NextAppProps } from "next/app";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";

export type AppProps = NextAppProps &
  WithAuthProps & {
    children: any;
    err?: any;
    apollo: ApolloClient<{}>;
  };

class MyApp extends App<AppProps> {
  render() {
    const { Component, pageProps, apollo, err } = this.props;

    if (err) {
      return <p>THERE IS AN ERROR: {JSON.stringify(err)}</p>;
    }

    const token = new AccessToken(pageProps.jit);
    apollo.link = apolloLinkSomething(token);

    return (
      <AppProviders apollo={apollo}>
        <Component {...pageProps} />
      </AppProviders>
    );
  }
}

export default withApollo(MyApp);
