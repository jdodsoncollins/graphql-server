import React from "react";
import withApollo, { apolloLinkSomething } from "@/app/lib/apollo_next";
import ApolloClient from "apollo-client";
import { WithAuthProps } from "@/app/lib/auth/with_auth";
import { AppProviders } from "@/app/lib/app_providers";
import App from "next/app";
import { AccessToken } from "@/app/lib/auth/tokens/access_token";

type Props = WithAuthProps & {
  err?: any;
  apollo: ApolloClient<{}>;
};

class MyApp extends App<Props> {
  render() {
    console.log(Object.keys(this.props));
    const { Component, pageProps, apollo, err } = this.props;

    if (err) {
      return <p>THERE IS AN ERROR: {JSON.stringify(err)}</p>;
    }

    const token = new AccessToken(pageProps.jit);
    console.log({ token });

    apollo.link = apolloLinkSomething(new AccessToken(pageProps.jit));

    return (
      <AppProviders apollo={apollo}>
        <Component {...pageProps} />
      </AppProviders>
    );
  }
}


export default withApollo(MyApp);
