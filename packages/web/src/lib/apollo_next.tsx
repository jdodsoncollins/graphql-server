import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-boost";
import fetch from "isomorphic-unfetch";
import withNextApollo from "next-with-apollo";
import getConfig from "next/config";

import { AccessToken } from "@/app/lib/auth/tokens/access_token";
import { refreshLink } from "@/app/lib/apollo_token_refresh_link";
import { parseCookies } from "nookies";

const { publicRuntimeConfig } = getConfig();

export const httpLink = new HttpLink({
  uri: `${publicRuntimeConfig.API_URL}/graphql`,
  credentials: "include",
  fetch,
});

export const authLink = (accessToken?: AccessToken) => {
  return new ApolloLink((operation, forward) => {
    operation.setContext(({ headers }: any) => ({
      headers: {
        ...headers,
        ...(accessToken && { Authorization: accessToken.authorizationString }),
      },
    }));
    return forward(operation);
  });
};

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.error("apollo next error");
  console.error({ graphQLErrors, networkError });
});

export const apolloLinkSomething = (token: AccessToken) => {
  return ApolloLink.from([refreshLink, authLink(token), errorLink, httpLink]);
};

export default withNextApollo(
  ({ initialState, ctx }) => {
    console.log("with next apollo props");
    console.log("withNextApollo", parseCookies(ctx));
    return new ApolloClient({
      ssrMode: true,
      link: apolloLinkSomething(new AccessToken()),
      cache: new InMemoryCache().restore(initialState || {}),
    });
  },
  {
    getDataFromTree: "always",
  }
);
