import React from "react";

import { AuthProvider } from "@/app/lib/auth/use_auth";
import { ApolloProvider } from "@apollo/react-common";
import { UserProvider } from "@/app/lib/auth/use_user";

export const AppProviders = ({ children, apollo, accessToken }: any) => {
  return (
    <ApolloProvider client={apollo}>
      <AuthProvider accessToken={accessToken}>
        <UserProvider>{children}</UserProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};
