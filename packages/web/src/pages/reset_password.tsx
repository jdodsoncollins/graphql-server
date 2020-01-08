import { FormikHelpers } from "formik";
import { useRouter } from "next/router";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import React from "react";

import { withLayout } from "@/app/components/layouts/layout";
import { useUpdatePasswordFromTokenMutation, useValidateForgotPasswordTokenMutation } from "@/generated/graphql";
import { ResetPasswordFormData } from "@/app/components/forms/reset_password_form";

type Props = {
  token: string;
  email: string;
};

const ResetPasswordForm = dynamic(() => import("@/app/components/forms/reset_password_form"), { ssr: false });

const ResetPassword: NextPage<Props> = () => {
  const router = useRouter();
  const { query: { e, u } } = router;
  const email = Array.isArray(e) ? e[0] : e;
  const token = Array.isArray(u) ? u[0] : u;
  const [updatePasswordMutation] = useUpdatePasswordFromTokenMutation();
  const [validateForgotPasswordTokenMutation] = useValidateForgotPasswordTokenMutation();

  const handleSubmit = async (data: ResetPasswordFormData, { setSubmitting }: FormikHelpers<ResetPasswordFormData>) => {
    await validateForgotPasswordTokenMutation({
      variables: { email, token },
    });
    await updatePasswordMutation({ variables: { data } });
    setSubmitting(false);
    await router.push("/login");
  };

  return (
    <>
      <h1 className="h5">Reset Password Page</h1>
      <ResetPasswordForm token={token} email={email} handleSubmit={handleSubmit} />
    </>
  );
};

export default withLayout(ResetPassword, {
  title: "Reset Password Page",
});
