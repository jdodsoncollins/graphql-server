import { NextPage } from "next";
import React, { useEffect } from "react";

import Layout from "@/app/components/layouts/layout";
import { useAuth } from "@/app/lib/auth/use_auth";
import { withAuth } from "@/app/lib/auth/with_auth";

type LogoutProps = {};

const Logout: NextPage<LogoutProps> = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <Layout title={"Sign Out"}>
      <h1>Logging Out...</h1>
    </Layout>
  );
};

export default withAuth(Logout);
