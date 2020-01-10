import React from "react";
import NextHead from "next/head";
import "normalize.css/normalize.css";

import { Header } from "@/app/components/layouts/partials/header";
import { colors } from "@/styles/theme";
import { Token } from "@/app/components/token";
import styled from "@emotion/styled";

type LayoutSettings = any & {
  title?: string;
};

const Layout: React.FC<LayoutSettings> = ({ title = "Default Page Title", children }) => {
  return (
    <React.StrictMode>
      <NextHead>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </NextHead>
      <Main>
        <Header />
        <Content>
          <Token />
          {children}
        </Content>
      </Main>
    </React.StrictMode>
  );
};

export default Layout;

const Main = styled.main`
  height: 100%;
  display: flex;
  flex-direction: column;
  color: ${colors.black};
  background-color: ${colors.gray["500"]};
`;

const Content = styled.div`
  flex: 1;
  color: ${colors.black};
  background-color: ${colors.gray["300"]};
`;
