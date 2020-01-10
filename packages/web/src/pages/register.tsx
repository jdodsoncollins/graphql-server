import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FormikHelpers } from "formik";
import { NextPage } from "next";
import React from "react";

import { useRegisterMutation } from "@/generated/graphql";
import Layout from "@/app/components/layouts/layout";
import { withAuth } from "@/app/lib/auth/with_auth";

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
  const router = useRouter();

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
    await router.push("/login");
  };

  return (
    <Layout title="Register Page">
      <h1>Register Page</h1>
      <RegisterForm handleSubmit={handleSubmit} />
    </Layout>
  );
};

export default withAuth(Register);
