import React from "react";
import { NextPage } from "next";
import Layout from "@/app/components/layouts/layout";
import { withAuth } from "@/app/lib/auth/with_auth";

const Dashboard: NextPage = () => {
  return (
    <Layout title={"The Dashboard"}>
      <div>HELLO DASHBOARD</div>
    </Layout>
  );
};
export default withAuth(Dashboard, true);
