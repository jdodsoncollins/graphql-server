import { NextPage } from "next";
import React, { useEffect } from "react";

import { withLayout } from "@/app/components/layouts/layout";
import { redirectToLogin } from "@/app/lib/redirect";
import { AuthType } from "@/app/lib/auth/use_auth";

type LogoutProps = AuthType & {};

const Logout: NextPage<LogoutProps> = ({ logout }) => {
  const handleLogout = async () => {
    await logout();
    await redirectToLogin();
  };

  useEffect(() => {
    handleLogout().catch(e => console.error(e));
  }, []);

  return <h1>Logging Out...</h1>;
};

export default withLayout(Logout, {
  title: "Logout Page",
});
