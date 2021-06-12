import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";
import styled from "styled-components";

const RightContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media only screen and (min-width: 1024px) {
    margin-top: 40px;
  }
`;

const Button = styled.button`
  background-color: #88d5ba;
  color: "#272727";
  border: none;
  border-radius: 4px;
  font-family: textFontLight;
  font-size: 20px;
  margin-bottom: 10px;
  padding: 0 20px;
  width: 240px;
`;

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [userUsername, setUserUsername] = useState("");
  const [userConfirmed, setUsertConfirmed] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  async function signUp(data) {
    const { username, email, password } = data;
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      setUserUsername(username);
      reset({
        username: "",
        email: "",
        password: "",
      });
    } catch (err) {
      console.log({ err, data });
      setErrMessage(err.message);
    }
  }

  async function confirmUser(data) {
    const { password } = data;
    try {
      await Auth.confirmSignUp(userUsername, password);
      reset({
        password: "",
      });
      setUsertConfirmed(true);
    } catch (err) {
      console.log({ err, data });
    }
  }

  async function resendCode() {
    try {
      await Auth.resendSignUp(userUsername);
      console.log("code resent successfully");
    } catch (err) {
      console.log("error resending code: ", err);
    }
  }

  if (userConfirmed === true) return <Redirect to="auth" />;

  if (userUsername) {
    return (
      <RightContainer>
        <p>
          Thank you, {userUsername} for signin up. <br />
          We sent a verification code to your email.
        </p>
        <input
          type="text"
          placeholder="verification code"
          {...register("password", { required: true })}
        />
        {errors.code && <p className="error-message">Code is required</p>}

        <Button onClick={handleSubmit(confirmUser)}>
          <p>Confirm your account</p>
        </Button>
        <p className="Button-text" onClick={() => resendCode}>
          {"< Resend code />"}
        </p>
      </RightContainer>
    );
  }

  return (
    <RightContainer>
      <input
        type="text"
        placeholder="Username"
        {...register("username", { required: true })}
      />
      {errors.username && <p className="error-message">Username is required</p>}

      <input
        type="text"
        placeholder="Email"
        {...register("email", { required: true })}
      />
      {errors.email && <p className="error-message">Email is required</p>}

      <input
        type="Password"
        placeholder="Password"
        {...register("password", { required: true })}
      />
      {errors.password && <p className="error-message">Password is required</p>}

      <Button onClick={handleSubmit(signUp)}>
        <p>Sign up</p>
      </Button>

      {errMessage && <p className="error-message">{errMessage}</p>}
    </RightContainer>
  );
};

export default SignUp;