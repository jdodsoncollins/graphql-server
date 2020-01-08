import { useAuth } from "@/app/lib/auth/use_auth";
import { createContext, useContext } from "react";

const UserContext = createContext<string>("");

export const UserProvider = (props: any) => (
  <UserContext.Provider value={useAuth().accessToken.decoded.email} {...props} />
);

export const useUser = () => useContext<string>(UserContext);
