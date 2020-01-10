import React from "react";
import { NextPage } from "next";

import Layout from "@/app/components/layouts/layout";
import { useMeQuery } from "@/generated/graphql";
import { withAuth } from "@/app/lib/auth/with_auth";

const Profile: NextPage = () => {
  const { data, loading, error } = useMeQuery({ fetchPolicy: "network-only" });

  let content: any = <div>Something went wrong!</div>;

  if (loading) {
    content = <div>Loading...</div>;
  }

  if (error) {
    content = <div>Error {JSON.stringify(error)}</div>;
  }

  if (data) {
    const { me } = data;
    content = (
      <div>
        <p>{me.uuid}</p>
        <p>{me.email}</p>
        <p>{me.name}</p>
      </div>
    );
  }

  return <Layout>{content}</Layout>;
};

export default withAuth(Profile, true);
