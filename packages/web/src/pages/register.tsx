import { FormikHelpers } from "formik";
import { NextPage } from "next";
import React from "react";

import { useRegisterMutation } from "@/generated/graphql";
import { withLayout } from "@/app/components/layouts/layout";
import { redirectToLogin } from "@/app/lib/redirect";
import dynamic from "next/dynamic";

export const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

type RegisterFormData = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

const RegisterForm = dynamic(() => import("@/app/components/forms/register_form"), { ssr: false });

const Register: NextPage<{}> = () => {
  const [register] = useRegisterMutation();

  const handleSubmit = async (
    registerFormData: RegisterFormData,
    { setSubmitting, setStatus }: FormikHelpers<RegisterFormData>
  ) => {
    try {
      await register({ variables: { data: registerFormData } });
    } catch (e) {
      setStatus(e.message);
    }
    setSubmitting(false);
    await redirectToLogin(undefined, true);
  };

  return (
    <>
      <h1>Register Page</h1>
      <RegisterForm handleSubmit={handleSubmit} />
    </>
  );
};

export default withLayout(Register, {
  title: "Register Page",
});
