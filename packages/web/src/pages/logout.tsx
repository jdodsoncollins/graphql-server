import { NextPage } from "next";
import React, { useEffect } from "react";

import { withLayout } from "@/app/components/layouts/layout";
import { AuthType, useAuth } from "@/app/lib/auth/use_auth";
import { useRouter } from "next/router";

type LogoutProps = AuthType & {};

const Logout: NextPage<LogoutProps> = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    await router.push("/login");
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return <h1>Logging Out...</h1>;
};

export default withLayout(Logout, {
  title: "Logout Page",
});
