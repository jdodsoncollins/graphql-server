import { FormikHelpers } from "formik";
import { NextPage } from "next";
import { withRouter } from "next/router";
import dynamic from "next/dynamic";
import { WithRouterProps } from "next/dist/client/with-router";
import React from "react";

import { useLoginMutation } from "@/generated/graphql";
import { withLayout } from "@/app/components/layouts/layout";
import { LoginFormData } from "@/app/components/forms/login_form";
import { Redirect } from "@/app/lib/redirect";
import { setAccessToken } from "@/app/lib/auth/in_memory_access_token";

type Props = WithRouterProps & {};

const LoginForm = dynamic(() => import("@/app/components/forms/login_form"), { ssr: false });

const LoginPage: NextPage<Props> = ({
  router: {
    query: { redirectTo, message },
  },
}) => {
  const [login] = useLoginMutation();

  const handleSubmit = async (data: LoginFormData, { setSubmitting, setStatus }: FormikHelpers<LoginFormData>) => {
    try {
      const response = await login({
        variables: { data },
      });
      if (response && response.data) {
        setAccessToken(response.data.login.accessToken);
      }
      setSubmitting(false);
      if (!redirectTo || redirectTo.includes("/login")) redirectTo = "/dashboard";
      if (Array.isArray(redirectTo)) redirectTo = redirectTo[0];
      await Redirect(redirectTo);
    } catch (e) {
      setStatus(e.message);
    }
  };

  return (
    <>
      <h1 className="h5">Login Page</h1>
      {message ? <p>{message}</p> : null}
      <LoginForm handleSubmit={handleSubmit} />
    </>
  );
};

export default withLayout(withRouter(LoginPage), {
  title: "Login Page",
});
