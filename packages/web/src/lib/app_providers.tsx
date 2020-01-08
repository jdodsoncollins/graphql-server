import { AuthProvider } from "@/app/lib/auth/use_auth";
import React from "react";
import { ApolloProvider } from "@apollo/react-common";

export const AppProviders = ({ children, apollo }: any) => {
  return (
    <ApolloProvider client={apollo}>
      <AuthProvider>{children}</AuthProvider>
    </ApolloProvider>
  );
};
