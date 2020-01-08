import { FormikHelpers } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import React from "react";

import { withLayout } from "@/app/components/layouts/layout";
import { LoginFormData } from "@/app/components/forms/login_form";
import { useAuth } from "@/app/lib/auth/use_auth";

type Props = {};

const LoginForm = dynamic(() => import("@/app/components/forms/login_form"), { ssr: false });

const LoginPage: NextPage<Props> = () => {
  const { query } = useRouter();
  const { login } = useAuth();

  const redirectTo = Array.isArray(query.redirectTo) ? query.redirectTo[0] : query.redirectTo;

  const handleSubmit = async (data: LoginFormData, { setSubmitting, setStatus }: FormikHelpers<LoginFormData>) => {
    try {
      await login(data, redirectTo);
      setSubmitting(false);
    } catch (e) {
      setStatus(e.message);
    }
  };

  return (
    <>
      <h1 className="h5">Login Page</h1>
      <LoginForm handleSubmit={handleSubmit} />
    </>
  );
};

export default withLayout(LoginPage, {
  title: "Login Page",
});
