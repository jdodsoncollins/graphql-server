import React from "react";
import { NextPage } from "next";

import { useUsersQuery } from "@/generated/graphql";
import { withLayout } from "@/app/components/layouts/layout";

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

  return <div>{body}</div>;
};

export default withLayout(Index, {
  title: "Hi ya slugger",
});
