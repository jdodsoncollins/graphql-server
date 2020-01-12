import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-boost";
import fetch from "isomorphic-unfetch";
import withNextApollo from "next-with-apollo";
import getConfig from "next/config";

import { refreshLink } from "@/app/lib/apollo_token_refresh_link";
import { getFromInMemory } from "@/app/lib/auth/with_auth";

const { publicRuntimeConfig } = getConfig();

export const httpLink = new HttpLink({
  uri: `${publicRuntimeConfig.API_URL}/graphql`,
  credentials: "include",
  fetch,
});

export const authLink = new ApolloLink((operation, forward) => {
  const { accessToken } = getFromInMemory();
  operation.setContext(({ headers }: any) => ({
    headers: {
      ...headers,
      ...(accessToken.isValid && { Authorization: accessToken.authorizationString }),
    },
  }));
  return forward(operation);
});

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  console.error("apollo next error");
  console.error({ graphQLErrors, networkError });
});

export const withApollo = withNextApollo(
  ({ initialState }) => {
    return new ApolloClient({
      ssrMode: true,
      link: ApolloLink.from([refreshLink, authLink, errorLink, httpLink]),
      cache: new InMemoryCache().restore(initialState || {}),
    });
  },
  {
    getDataFromTree: "always",
  }
);
