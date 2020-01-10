import React from "react";
import { NextPage } from "next";

import { useUsersQuery } from "@/generated/graphql";
import Layout from "@/app/components/layouts/layout";
import { withAuth } from "@/app/lib/auth/with_auth";

const Index: NextPage<any> = () => {
  const { data } = useUsersQuery({ fetchPolicy: "network-only" });
  let body;
  if (!data) {
    body = <p>loading...</p>;
  } else {
    body = (
      <>
        <p>users:</p>
        <ul>
          {data.users.map(x => (
            <li key={x.uuid}>{x.email}</li>
          ))}
        </ul>
      </>
    );
  }

  return <Layout title={"Hi ya slugger"}>{body}</Layout>;
};

export default withAuth(Index);
