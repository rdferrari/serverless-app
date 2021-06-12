import React, { useState } from "react";
import styled from "styled-components";
import Tagline from "../components/TagLine";

import SignInC from "../components/SignIn";
import SignUpC from "../components/SignUp";

const AuthContainer = styled.div`
  margin: 50px 0;
  width 100%;

  @media only screen and (min-width: 1024px) {
    margin: 0 auto;
    padding: 200px 0;
    width 700px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media only screen and (min-width: 1024px) {
    flex-direction: row;
  }
`;

const AuthToggle = styled.div`
  text-align: center;

  @media only screen and (min-width: 1024px) {
    text-align: left;
  }
`;

const AuthPage = () => {
  const [signup, setSignup] = useState(false);

  return (
    <AuthContainer>
      <ContentContainer>
        <div>
          <Tagline />
          <AuthToggle>
            <p>
              {signup === false
                ? "If you do not have an account"
                : "If you have an account"}
            </p>
            <p className="button-text" onClick={() => setSignup(!signup)}>
              {signup === false ? "< Sign up />" : "< Sign in />"}
            </p>
          </AuthToggle>
        </div>

        {signup === false ? <SignInC /> : <SignUpC />}
      </ContentContainer>
    </AuthContainer>
  );
};

export default AuthPage;
