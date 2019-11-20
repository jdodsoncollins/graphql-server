import React from "react";
import { Formik } from "formik";

import { withApollo } from "@/app/lib/apollo_next";
import { useRegisterMutation } from "@/generated/graphql";
import { Layout } from "@/app/components/layouts/layout";

const validEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const page = () => {
  const [register, { called, loading }] = useRegisterMutation();
  console.log(called, loading);

  const onSubmit = async (data: any, { setSubmitting, setError }: any) => {
    await register({
      variables: { data },
    }).catch(e => setError(e.message));
    setSubmitting(false);
  };
  const validate = (values: any) => {
    let errors: any = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (!validEmail.test(values.email)) {
      errors.email = "Invalid email address";
    }
    return errors;
  };
  return <Layout>
    <p>Register Page</p>
    <Formik
      initialValues={{ email: "jason@raimondi.us", password: "" }}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({
          error,
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => {
        return <form onSubmit={handleSubmit}>
            {error}
          <label style={{ display: "block" }}>
            Email
            <input
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
          </label>
          {errors.email && touched.email && errors.email}
          <label style={{ display: "block" }}>
            Password
            <input
              type="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
          </label>
          {errors.password && touched.password && errors.password}
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </form>
      }}
    </Formik>
  </Layout>;
};

export default withApollo(page);