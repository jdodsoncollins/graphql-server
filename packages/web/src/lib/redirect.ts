// import Router from "next/router";
import { NextPageContext } from "next";

export const Redirect = (target: string, ctx?: NextPageContext) => {
  console.log("REDIRECTING....", target);
  if (!!ctx?.res) {
    console.log("REDIRECTING.... on the server");
    // server
    // 303: "See other"
    ctx.res.writeHead(303, { Location: target });
    ctx.res.end();
  } else {
    console.log("ROUTER SHOULD BE PUSHING", target);
    // Router.push(target);
    document.location.pathname = target;
  }
};

export const redirectToLogin = (ctx?: NextPageContext, doNotRedirectBack = false) => {
  let redirectLink = ctx?.pathname ?? "";

  if (redirectLink) {
    redirectLink = `?redirectTo=${encodeURI(redirectLink)}`;
  }

  if (doNotRedirectBack) {
    redirectLink = "";
  }

  Redirect(`/login${redirectLink}`, ctx);
};
