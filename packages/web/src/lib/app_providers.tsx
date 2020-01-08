import React from "react";

import { AuthProvider } from "@/app/lib/auth/use_auth";
import { ApolloProvider } from "@apollo/react-common";
import { UserProvider } from "@/app/lib/auth/use_user";

export const AppProviders = ({ children, apollo }: any) => {
  return (
    <ApolloProvider client={apollo}>
      <AuthProvider>
        <UserProvider>
          {children}
        </UserProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};
