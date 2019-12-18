import React, { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { Link } from "@/app/components/hoc/nav_link";
import { colors } from "@/styles/theme";
import { getAuth } from "@/app/lib/auth";

interface Props {}

export const Header: React.FC<Props> = () => {
  const [auth] = useState(getAuth());
  console.log(auth);
  return (
    <header>
      <nav
        css={css`
          display: flex;
        `}
      >
        <Link href="/">
          <NavAnchor>Home</NavAnchor>
        </Link>
        <Link href="/profile">
          <NavAnchor>Testing Profile</NavAnchor>
        </Link>
        {auth.accessToken?.isValid ? (
          <>
            <Link href="/dashboard">
              <NavAnchor>Dashboard</NavAnchor>
            </Link>
            <Link href="/profile">
              <NavAnchor>Profile</NavAnchor>
            </Link>
            <Link href="/logout">
              <NavAnchor data-test="logout-link">Logout</NavAnchor>
            </Link>
          </>
        ) : (
          <>
            <Link href="/register">
              <NavAnchor data-test="register-link">Register</NavAnchor>
            </Link>
            <Link href="/login">
              <NavAnchor data-test="login-link">Login</NavAnchor>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

const NavAnchor = styled.a`
  color: ${colors.gray["100"]};
  font-weight: 500;
  padding: 0.5rem 0;

  &:hover,
  &:active {
    color: ${colors.gray["400"]};
  }

  &:after {
    content: "|";
    color: ${colors.black};
    text-decoration: none;
    padding: 0 2px;
  }
  &:last-child:after {
    content: "";
    padding: 0;
  }
`;
